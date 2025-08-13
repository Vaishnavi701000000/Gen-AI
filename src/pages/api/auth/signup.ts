// // pages/api/auth/signup.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";
// import bcrypt from "bcryptjs";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { username, email, password } = req.body;

//   try {
//     const db = await mysql.createConnection({ host: "localhost", user: "root", password: "Ramyam01", database: "vaishnavi_db" });

//     const [existing]: any = await db.query("SELECT id FROM users WHERE email = ? OR username = ?", [email, username]);
//     if (existing.length > 0) return res.status(400).json({ message: "User already exists." });

//     const hashed = await bcrypt.hash(password, 10);
//     await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashed]);

//     await db.end();
//     res.status(200).json({ message: "Signup successful" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// }
// import type { NextApiRequest, NextApiResponse } from "next";

// let users: { userId: string; password: string; role: string }[] = [];

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { userId, password, role } = req.body;

//     if (users.find(u => u.userId === userId)) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     users.push({ userId, password, role });
//     return res.status(200).json({ message: "Signup successful" });
//   }
//   res.status(405).end();
// }

// pages/api/auth/signup.ts
// pages/api/auth/signup.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import { pool } from "@/lib/db";
// import crypto from "crypto";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { userId, password, role } = req.body;

//   if (!userId || !password) {
//     return res.status(400).json({ message: "Missing userId or password" });
//   }

//   const hashedPassword = crypto.createHash("sha512").update(password).digest("hex");

//   try {
//     await pool.query(
//       "INSERT INTO users (userId, password, role, managed_dbs) VALUES (?, ?, ?, JSON_ARRAY())",
//       [userId, hashedPassword, role || "user"]
//     );
//     return res.status(201).json({ message: "Signup successful. Please login." });
//   } catch (error: any) {
//     console.error(error);
//     if (error.code === "ER_DUP_ENTRY") {
//       return res.status(409).json({ message: "UserId already exists" });
//     }
//     return res.status(500).json({ message: "Signup failed" });
//   }
// }



import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import crypto from "crypto";

// You must not specify the database in the initial pool connection so you can CREATE it
const pool = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // DON'T specify database here yet
});

async function ensureDatabaseAndTable() {
  // 1. Create DB if not exists
  await pool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQLDATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  // 2. Use the DB for subsequent queries
  await pool.query(`USE ${process.env.MYSQLDATABASE}`);
  // 3. Create the users table if not exists
await pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user', 'guest') DEFAULT 'user',
    managed_dbs JSON,
    UNIQUE KEY unique_userId (userId)
  ) CHARACTER SET = utf8mb4
`);

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, password, role } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ message: "Missing userId or password" });
  }

  const hashedPassword = crypto.createHash("sha512").update(password).digest("hex");

  try {
    await ensureDatabaseAndTable(); // <--- KEY LINE

    // Now connect again, but specify database for type-safe queries if needed
    // If using a singleton pool with database in config, you can skip this line next time.
    await pool.query(`USE ${process.env.MYSQLDATABASE}`);

    await pool.query(
      "INSERT INTO users (userId, password, role, managed_dbs) VALUES (?, ?, ?, JSON_ARRAY())",
      [userId, hashedPassword, role || "user"]
    );
    return res.status(201).json({ message: "Signup successful. Please login." });
  } catch (error: any) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "UserId already exists" });
    }
    return res.status(500).json({ message: "Signup failed" });
  }
}



// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";

// // Create a connection pool using only env variables
// const pool = mysql.createPool({
//   host: process.env.DB_HOST!,
//   user: process.env.DB_USER!,
//   password: process.env.DB_PASSWORD!,
//   port: Number(process.env.DB_PORT) || 3306,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { userId, host, port, db_name, db_username, db_password } = req.body;

//   if (!userId || !host || !port || !db_name || !db_username || !db_password) {
//     return res.status(400).json({ message: "Missing required fields" });
//   }

//   try {
//     // The pool already connects to the DB specified in .env (no need for USE query)
//     const [rows]: any = await pool.query(
//       "SELECT managed_dbs FROM users WHERE userId = ?",
//       [userId]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     let managedDbs = rows[0].managed_dbs || [];

//     // Parse if stored as JSON string
//     if (typeof managedDbs === "string") {
//       managedDbs = JSON.parse(managedDbs);
//     }

//     // Deactivate all others
//     managedDbs.forEach((db: any) => (db.isActive = false));

//     // Add new DB config, mark as active
//     managedDbs.push({
//       host,
//       port,
//       db_name,
//       db_username,
//       db_password,
//       isActive: true,
//     });

//     await pool.query(
//       "UPDATE users SET managed_dbs = ? WHERE userId = ?",
//       [JSON.stringify(managedDbs), userId]
//     );

//     return res.status(200).json({ message: "Data source added and activated" });
//   } catch (error) {
//     console.error("Error adding data source:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// }
