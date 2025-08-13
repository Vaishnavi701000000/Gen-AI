// /pages/api/query/execute.ts
import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import { pool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { sql, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in request." });
  }

  if (!sql) {
    return res.status(400).json({ message: "Missing SQL query in request." });
  }

  try {
    // get the user's managed_dbs
    const [rows] = await pool.query("SELECT managed_dbs FROM users WHERE userId = ?", [userId]);
const userRow = (rows as any[])[0];

if (!userRow || !userRow.managed_dbs) {
  return res.status(400).json({ message: "No managed_dbs found for user." });
}

const managedDbs = userRow.managed_dbs; // no JSON.parse
const activeDb = managedDbs.find((db: any) => db.isActive === true);
if (!activeDb) {
  return res.status(400).json({ message: "No active database selected." });
}


    // create a direct connection to active DB
    const connection = await mysql.createConnection({
      host: activeDb.host,
      user: activeDb.db_username,
      password: activeDb.db_password,
      port: parseInt(activeDb.port),
      database: activeDb.db_name,
    });

    const [results] = await connection.query(sql);
    await connection.end();

    return res.status(200).json({ results });
  } catch (error: any) {
    console.error("Error executing query:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
}
