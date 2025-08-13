// import type { NextApiRequest, NextApiResponse } from "next";
// import { pool } from "@/lib/db";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { userId, db_name } = req.body;

//   if (!userId || !db_name) {
//     return res.status(400).json({ message: "Missing userId or db_name" });
//   }

//   try {
//     // get the current managed_dbs
//     const [rows] = await pool.query(
//       "SELECT managed_dbs FROM users WHERE userId = ?",
//       [userId]
//     );

//     const userRow = (rows as any[])[0];

//     if (!userRow) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const managedDbs = userRow.managed_dbs as any[];

//     // update isActive flags
//     const updatedDbs = managedDbs.map((db: any) => ({
//       ...db,
//       isActive: db.db_name === db_name, // only activate this db
//     }));

//     // store back
//     await pool.query(
//       "UPDATE users SET managed_dbs = ? WHERE userId = ?",
//       [JSON.stringify(updatedDbs), userId]
//     );

//     return res.status(200).json({ message: `Database ${db_name} activated successfully` });
//   } catch (error) {
//     console.error("Error in activate-db API:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// }



// pages/api/manage/activate-db.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

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

    managedDbs = managedDbs.map((db) => ({
      ...db,
      isActive: db.id === connectionId
    }));

    await pool.query(
      "UPDATE users SET managed_dbs = ? WHERE userId = ?",
      [JSON.stringify(managedDbs), userId]
    );

    return res.status(200).json({ message: "Datasource activated successfully" });
  } catch (err) {
    console.error("activate-db error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
