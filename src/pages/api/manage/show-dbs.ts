// import type { NextApiRequest, NextApiResponse } from "next";
// import { pool } from "@/lib/db";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "GET") return res.status(405).end();

//   const userId = req.query.userId as string;

//   if (!userId) {
//     return res.status(400).json({ message: "Missing userId" });
//   }

//   try {
//     console.log("Checking managed_dbs for userId:", userId);

//     const [rows] = await pool.query(
//       "SELECT managed_dbs FROM users WHERE userId = ?",
//       [userId]
//     );

//     console.log("Query result rows:", rows);

//     const userRow = (rows as any[])[0];

//     if (!userRow) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const parsedDbs = userRow.managed_dbs;
//     console.log("Parsed databases:", parsedDbs);

//     return res.status(200).json({ databases: parsedDbs });



//   } catch (error) {
//     console.error("Error in show-dbs API:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// }




// pages/api/manage/show-dbs.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const userId = req.query.userId as string;

  if (!userId) return res.status(400).json({ message: "Missing userId" });

  try {
    const [rows] = await pool.query<any[]>("SELECT managed_dbs FROM users WHERE userId = ?", [userId]);
    const userRow = rows && rows.length > 0 ? rows[0] : null;

    if (!userRow) return res.status(404).json({ message: "User not found" });

    let parsedDbs: any[] = [];

    if (userRow.managed_dbs) {
      if (typeof userRow.managed_dbs === "string") {
        try {
          parsedDbs = JSON.parse(userRow.managed_dbs);
        } catch {
          parsedDbs = [];
        }
      } else if (Array.isArray(userRow.managed_dbs)) {
        parsedDbs = userRow.managed_dbs;
      }
    }

    // normalize port types
    parsedDbs = parsedDbs.map((d) => ({
      ...d,
      port: typeof d.port === "number" ? d.port : parseInt(String(d.port || 3306)),
    }));

    return res.status(200).json({ databases: parsedDbs });
  } catch (err) {
    console.error("show-dbs error:", err);
    return res.status(500).json({ message: "Something went wrong" });
  }
}
