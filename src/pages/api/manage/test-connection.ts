// pages/api/manage/test-connection.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { host, port, db_username, db_password, database } = req.body;

  if (!host || !db_username) {
    return res.status(400).json({ message: "Missing host or db_username" });
  }

  try {
    const conn = await mysql.createConnection({
      host,
      port: port ? parseInt(String(port)) : 3306,
      user: db_username,
      password: db_password,
      database: database || undefined,
      connectTimeout: 5000,
    });

    await conn.ping();
    await conn.end();

    return res.status(200).json({ ok: true, message: "Connection successful" });
  } catch (err: any) {
    console.error("test-connection error:", err);
    return res.status(500).json({ ok: false, message: err.message || "Connection failed" });
  }
}
