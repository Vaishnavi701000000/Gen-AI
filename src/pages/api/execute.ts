// pages/api/query/execute.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getActiveDatabase } from "@/lib/getActiveDatabase"; // adjust path if needed
import { createPool } from "mysql2/promise";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { sql, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const activeDb = await getActiveDatabase(userId);

    if (!activeDb) {
      return res.status(400).json({ message: "No active database found for this user" });
    }

    // const pool = createPool({
    //   host: activeDb.host,
    //   port: parseInt(activeDb.port),
    //   user: activeDb.db_username,
    //   password: activeDb.db_password,
    //   database: activeDb.db_name,
    //   waitForConnections: true,
    //   connectionLimit: 10,
    // });
    const pool = createPool({
      host: activeDb.host || "localhost",
      port: activeDb.port ? Number(activeDb.port) : 3306, // Ensure it's a number
      user: activeDb.db_username || "",
      password: activeDb.db_password || "",
      database: activeDb.db_name || undefined, // Remove null, use undefined if missing
      waitForConnections: true,
      connectionLimit: 10,
    });
    

    const [rows] = await pool.query(sql);
    return res.status(200).json({ result: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to execute query" });
  }
}

// import type { NextApiRequest, NextApiResponse } from "next";
// import { getActiveDatabase } from "@/lib/getActiveDatabase"; // adjust path if needed
// import { createPool } from "mysql2/promise";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { sql, userId } = req.body;

//   if (!userId) {
//     return res.status(400).json({ message: "Missing userId" });
//   }

//   try {
//     const activeDb = await getActiveDatabase(userId);

//     if (!activeDb) {
//       return res.status(400).json({ message: "No active database found for this user" });
//     }

//     const pool = createPool({
//       host: activeDb.host,
//       port: parseInt(activeDb.port),
//       user: activeDb.db_username,
//       password: activeDb.db_password,
//       database: activeDb.db_name,
//       waitForConnections: true,
//       connectionLimit: 10,
//     });

//     const [rows] = await pool.query(sql);
//     return res.status(200).json({ result: rows });
//   } catch (error: any) {
//     console.error("Query execution error:", error);
//     return res.status(500).json({ message: error.message || "Failed to execute query" });
//   }
// }
