// // pages/api/manage/create-db.ts
// import { NextApiRequest, NextApiResponse } from 'next';
// import mysql from 'mysql2/promise';
// import { pool } from '@/lib/db'; 

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') return res.status(405).end();

//   const { userId, db_name } = req.body;

//   if (!userId || !db_name ) {
//     return res.status(400).json({ message: "Missing details to create database." });
//   }

//   try {
 
//     const tempConn = await mysql.createConnection({
//       host:process.env.DB_HOST,
//       port: process.env.PORT ? parseInt(process.env.PORT) : 3306,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD ,
//       multipleStatements: true,
//     });

//     await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${db_name}\` CHARACTER SET utf8mb4`);
//     await tempConn.end();

 
//     const [rows] = await pool.query<any[]>(
//   'SELECT managed_dbs FROM users WHERE userId = ?',
//   [userId]
// );

// let managedDbs: any[] = [];
// if (Array.isArray(rows) && rows.length > 0 && rows[0].managed_dbs) {
//   if (typeof rows[0].managed_dbs === 'string') {
//     try {
//       managedDbs = JSON.parse(rows[0].managed_dbs);
//     } catch {
//       managedDbs = [];
//     }
//   } else {
//     managedDbs = rows[0].managed_dbs;
//   }
// }


//     managedDbs.push({
//       host:process.env.DB_HOST,
//       port: process.env.PORT ? parseInt(process.env.PORT) : 3306,
//       db_name: db_name,
//       db_username: process.env.DB_USER,
//       db_password: process.env.DB_PASSWORD,
//       isActive: false,
//     });

//     await pool.query(
//       'UPDATE users SET managed_dbs = ? WHERE userId = ?',
//       [JSON.stringify(managedDbs), userId]
//     );

//     return res.status(201).json({ message: 'Database created and added to managed_dbs.' });
//   } catch (error: any) {
//     console.error(error);
//     return res.status(500).json({ message: error.message || "Server error" });
//   }
// }



// pages/api/manage/create-db.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import { pool } from "@/lib/db";
import { getActiveDatabase } from "@/lib/getActiveDatabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, db_name } = req.body;
  if (!userId || !db_name) {
    return res.status(400).json({ message: "Missing details to create database." });
  }

  try {
    const activeDb = await getActiveDatabase(userId);
    if (!activeDb) {
      return res.status(400).json({ message: "No active datasource selected." });
    }

    const tempConn = await mysql.createConnection({
      host: activeDb.host,
      port: activeDb.port || 3306,
      user: activeDb.db_username,
      password: activeDb.db_password,
      multipleStatements: true
    });

    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${db_name}\` CHARACTER SET utf8mb4`);
    await tempConn.end();

    // Save into managed_dbs for that connection (optional — some people keep it global)
    const [rows] = await pool.query<any[]>(
      "SELECT managed_dbs FROM users WHERE userId = ?",
      [userId]
    );
    const userRow = rows && rows.length > 0 ? rows[0] : null;
    let managedDbs: any[] = [];
    if (userRow && userRow.managed_dbs) {
      managedDbs = typeof userRow.managed_dbs === "string"
        ? JSON.parse(userRow.managed_dbs)
        : userRow.managed_dbs;
    }

    // Append or update db_name if needed
    // (Not always necessary — depends on how you want to store it)
    
    await pool.query(
      "UPDATE users SET managed_dbs = ? WHERE userId = ?",
      [JSON.stringify(managedDbs), userId]
    );

    return res.status(201).json({ message: "Database created on active datasource." });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
}
