
// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { table } = req.query;

//   try {
//     const connection = await mysql.createConnection({
//       host: "localhost",
//       user: "root",
//       password: "Ramyam01",
//       database: "client1_db",
//     });

//     const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
//     await connection.end();

//     res.status(200).json({ rows });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch data" });
//   }
// }

// /api/table-data.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { table, db } = req.query;

//   if (!table || !db) {
//     return res.status(400).json({ error: "Missing table or database name." });
//   }

//   try {
//     const connection = await mysql.createConnection({
//       host: process.env.MYSQLHOST,
//       user: process.env.MYSQLUSER,
//       password: process.env.MYSQLPASSWORD,
//       database: db as string,
//     });

//     const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
//     await connection.end();

//     res.status(200).json({ rows });
//   } catch (error) {
//     console.error("Error fetching table data:", error);
//     res.status(500).json({ error: "Failed to fetch table data." });
//   }
// }






// pages/api/table-data.ts
import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import { pool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { table, userId } = req.query;

  if (!table || !userId) {
    return res.status(400).json({ error: "Missing table name or userId." });
  }

  try {
    // 1️⃣ Get user's active DB
    const [rows] = await pool.query("SELECT managed_dbs FROM users WHERE userId = ?", [userId]);
    const userRow = (rows as any[])[0];

    if (!userRow || !userRow.managed_dbs) {
      return res.status(400).json({ error: "No managed_dbs found for user." });
    }

    const managedDbs = userRow.managed_dbs;
    const activeDb = managedDbs.find((db: any) => db.isActive === true);

    if (!activeDb) {
      return res.status(400).json({ error: "No active database selected." });
    }

    // 2️⃣ Connect to that active DB
    const connection = await mysql.createConnection({
      host: activeDb.host,
      user: activeDb.db_username,
      password: activeDb.db_password,
      port: parseInt(activeDb.port),
      database: activeDb.db_name,
    });

    // 3️⃣ Fetch the table data
    const [results] = await connection.query(`SELECT * FROM \`${table}\``);
    await connection.end();

    res.status(200).json({ rows: results });
  } catch (error) {
    console.error("Error fetching table data:", error);
    res.status(500).json({ error: "Failed to fetch table data." });
  }
}