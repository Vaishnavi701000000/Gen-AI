import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { userId, managed_dbs } = req.body;

  if (!userId || !managed_dbs) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    await pool.query(
      "UPDATE users SET managed_dbs = ? WHERE userId = ?",
      [JSON.stringify(managed_dbs), userId]
    );
    return res.status(200).json({ message: "Databases updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update databases" });
  }
}
