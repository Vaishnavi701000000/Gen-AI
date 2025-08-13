
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
import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { table, db } = req.query;

  if (!table || !db) {
    return res.status(400).json({ error: "Missing table or database name." });
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: db as string,
    });

    const [rows] = await connection.query(`SELECT * FROM \`${table}\``);
    await connection.end();

    res.status(200).json({ rows });
  } catch (error) {
    console.error("Error fetching table data:", error);
    res.status(500).json({ error: "Failed to fetch table data." });
  }
}
