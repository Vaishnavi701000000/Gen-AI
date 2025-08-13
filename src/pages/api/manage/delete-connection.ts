// pages/api/manage/delete-connection.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { userId, connectionId } = req.body;
  if (!userId || !connectionId) {
    return res.status(400).json({ message: "Missing userId or connectionId" });
  }

  try {
    const [rows] = await pool.query<any[]>(
      "SELECT managed_dbs FROM users WHERE userId = ?",
      [userId]
    );
    const userRow = rows && rows.length > 0 ? rows[0] : null;
    if (!userRow) return res.status(404).json({ message: "User not found" });

    let managedDbs: any[] = [];
    if (userRow.managed_dbs) {
      managedDbs = typeof userRow.managed_dbs === "string"
        ? JSON.parse(userRow.managed_dbs)
        : userRow.managed_dbs;
    }

    managedDbs = managedDbs.filter((db) => db.id !== connectionId);

    await pool.query(
      "UPDATE users SET managed_dbs = ? WHERE userId = ?",
      [JSON.stringify(managedDbs), userId]
    );

    return res.status(200).json({ message: "Datasource removed" });
  } catch (err) {
    console.error("delete-connection error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
