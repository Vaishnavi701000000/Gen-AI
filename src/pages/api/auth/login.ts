// // // pages/api/auth/login.ts
// // import type { NextApiRequest, NextApiResponse } from "next";
// // import mysql from "mysql2/promise";
// // import bcrypt from "bcryptjs";

// // export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// //   const { email, password } = req.body;

// //   try {
// //     const db = await mysql.createConnection({ host: "localhost", user: "root", password: "Ramyam01", database: "vaishnavi_db" });

// //     const [rows]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
// //     const user = rows[0];
// //     if (!user) return res.status(400).json({ message: "Invalid email" });

// //     const match = await bcrypt.compare(password, user.password);
// //     if (!match) return res.status(400).json({ message: "Invalid password" });

// //     // Success
// //     res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email } });
// //   } catch (error) {
// //     res.status(500).json({ message: "Server error" });
// //   }
// // }
// // src/pages/api/auth/login.ts
// import type { NextApiRequest, NextApiResponse } from "next";

// const mockUsers = [
//   { userId: "admin", password: "admin123", role: "admin" },
//   { userId: "user1", password: "user123", role: "user" },
// ];

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { userId, password } = req.body;

//     const user = mockUsers.find(
//       (u) => u.userId === userId && u.password === password
//     );

//     if (user) {
//       res.status(200).json({ role: user.role, token: "fake-jwt-token" });
//     } else {
//       res.status(401).json({ message: "Invalid credentials" });
//     }
//   } else {
//     res.status(405).end();
//   }
// }
// import type { NextApiRequest, NextApiResponse } from "next";

// const users: { userId: string; password: string; role: string }[] = [
//   { userId: "admin", password: "admin123", role: "admin" },
// ];

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { userId, password } = req.body;
//     const user = users.find(u => u.userId === userId && u.password === password);

//     if (user) {
//       return res.status(200).json({ message: "Login successful", token: "mock-token", role: user.role });
//     } else {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//   }
//   res.status(405).end();
// }
// pages/api/auth/login.ts


// import type { NextApiRequest, NextApiResponse } from "next";
// import { pool } from "@/lib/db";
// import crypto from "crypto";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { userId, password } = req.body;

//   if (!userId || !password) {
//     return res.status(400).json({ message: "Missing userId or password" });
//   }

//   const hashedPassword = crypto.createHash("sha512").update(password).digest("hex");

//   try {
//     const [rows]: any = await pool.query(
//       "SELECT * FROM users WHERE userId = ? AND password = ?",
//       [userId, hashedPassword]
//     );

//     if (rows.length === 0) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const user = rows[0];

//     // you can later generate real JWT if needed
//     const token = "mock-token";

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       role: user.role,
//       userId: user.userId,           // add this line!
//       managed_dbs: user.managed_dbs ?? [],
//     });
    
    
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Login failed" });
//   }
// }

import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "@/lib/db";
import crypto from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ message: "Missing userId or password" });
  }

  const hashedPassword = crypto.createHash("sha512").update(password).digest("hex");

  try {
    // ✅ Make sure to use correct DB
    const [rows]: any = await pool.query(
      `SELECT * FROM ${process.env.MYSQLDATABASE}.users WHERE userId = ? AND password = ?`,
      [userId, hashedPassword]
    );

    console.log("🔐 Login attempt:", userId);
    console.log("🧠 Hashed password:", hashedPassword);
    console.log("🧾 Result:", rows);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    const token = "mock-token"; // future: JWT

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user.userId,
      managed_dbs: user.managed_dbs ?? [],
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
}
