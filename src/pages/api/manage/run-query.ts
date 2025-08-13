// // import type { NextApiRequest, NextApiResponse } from "next";
// // import { pool } from "@/lib/db";
// // import { getActiveDatabase } from "@/lib/getActiveDatabase";

// // export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// //   if (req.method !== "POST") return res.status(405).end();

// //   const { sql } = req.body;

// //   if (!sql) {
// //     return res.status(400).json({ message: "Missing SQL query" });
// //   }

// //   try {
// //     // get the active database connection details
// //     const activeDb = await getActiveDatabase();

// //     if (!activeDb) {
// //       return res.status(400).json({ message: "No active database selected" });
// //     }

// //     // create a new pool for the active DB
// //     const activePool = pool.active(activeDb);

// //     // run the query
// //     const [rows] = await activePool.query(sql);

// //     console.log("Query results:", rows);

// //     return res.status(200).json({ results: rows });

// //   } catch (error) {
// //     console.error("Error running query:", error);
// //     return res.status(500).json({ message: "Something went wrong" });
// //   }
// // }

// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";
// import { getActiveDatabase } from "@/lib/getActiveDatabase";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "POST") return res.status(405).end();

//   const { sql, userId } = req.body;

//   if (!sql || !userId) {
//     return res.status(400).json({ error: "Missing sql or userId" });
//   }

//   const activeDb = await getActiveDatabase(userId);

//   if (!activeDb) {
//     return res.status(400).json({ error: "No active database found." });
//   }

//   try {
//     const tempPool = mysql.createPool({
//       host: activeDb.host,
//       user: activeDb.db_username,
//       password: activeDb.db_password,
//       database: activeDb.db_name,
//       port: activeDb.port,
//       waitForConnections: true,
//       connectionLimit: 5,
//     });

//     const [rows] = await tempPool.query(sql);

//     await tempPool.end();

//     res.status(200).json({ results: rows });
//   } catch (err) {
//     console.error("Query execution error:", err);
//     res.status(500).json({ error: "Failed to execute query." });
//   }
// }



// pages/api/manage/run-query.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import { getActiveDatabase } from "@/lib/getActiveDatabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { sql, userId } = req.body;
  if (!sql || !userId) {
    return res.status(400).json({ error: "Missing sql or userId" });
  }

  const activeDb = await getActiveDatabase(userId);
  if (!activeDb) {
    return res.status(400).json({ error: "No active database found." });
  }

  try {
    const tempPool = mysql.createPool({
      host: activeDb.host,
      user: activeDb.db_username,
      password: activeDb.db_password,
      database: activeDb.db_name || undefined,
      port: activeDb.port,
      waitForConnections: true,
      connectionLimit: 5
    });

    const [rows] = await tempPool.query(sql);
    await tempPool.end();

    res.status(200).json({ results: rows });
  } catch (err) {
    console.error("Query execution error:", err);
    res.status(500).json({ error: "Failed to execute query." });
  }
}
