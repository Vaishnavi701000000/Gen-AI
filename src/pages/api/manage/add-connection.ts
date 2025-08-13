// pages/api/manage/add-connection.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import { pool } from "@/lib/db";

function makeId() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, host, port, db_username, db_password, db_name, label, testConnection } = req.body;

  if (!userId || !host || !db_username) {
    return res.status(400).json({ message: "Missing required fields: userId, host, db_username" });
  }

  // optionally test connection before saving
  if (testConnection) {
    try {
      const testConn = await mysql.createConnection({
        host,
        port: port ? parseInt(String(port)) : 3306,
        user: db_username,
        password: db_password,
        database: db_name || undefined,
        connectTimeout: 5000,
      });
      await testConn.ping();
      await testConn.end();
    } catch (err: any) {
      return res.status(400).json({ ok: false, message: "Connection test failed: " + (err.message || err) });
    }
  }

  try {
    const [rows] = await pool.query<any[]>("SELECT managed_dbs FROM users WHERE userId = ?", [userId]);
    const userRow = rows && rows.length > 0 ? rows[0] : null;

    let managedDbs: any[] = [];

    if (userRow && userRow.managed_dbs) {
      if (typeof userRow.managed_dbs === "string") {
        try {
          managedDbs = JSON.parse(userRow.managed_dbs);
        } catch {
          managedDbs = [];
        }
      } else if (Array.isArray(userRow.managed_dbs)) {
        managedDbs = userRow.managed_dbs;
      }
    }

    const newEntry = {
      id: makeId(),
      label: label || `${host}:${port || 3306}${db_name ? `/${db_name}` : ""}`,
      host,
      port: port ? parseInt(String(port)) : 3306,
      db_name: db_name || null,
      db_username,
      db_password: db_password || null,
      isActive: false,
    };

    managedDbs.push(newEntry);

    await pool.query("UPDATE users SET managed_dbs = ? WHERE userId = ?", [JSON.stringify(managedDbs), userId]);

    return res.status(201).json({ ok: true, connection: newEntry });
  } catch (err) {
    console.error("add-connection error:", err);
    return res.status(500).json({ ok: false, message: "Failed to add connection" });
  }
}
