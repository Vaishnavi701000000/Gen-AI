import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { id, isActive } = req.body;

  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.CONFIG_DB_NAME || "config_db",
    });

    await connection.execute("UPDATE tenants SET isActive = ? WHERE id = ?", [isActive, id]);
    await connection.end();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Toggle error:", error);
    res.status(500).json({ success: false, error: "Failed to toggle status" });
  }
}
