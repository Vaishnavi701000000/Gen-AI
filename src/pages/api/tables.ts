// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const connection = await mysql.createConnection({
//       host: "localhost",
//       user: "root",
//       password: "Ramyam01",
//       database: "client1_db",
//     });

//     const [rows]: [any[], any] = await connection.query(`SHOW TABLES`);
//     await connection.end();

//     const tables = rows.map((row: any) => Object.values(row)[0]);
//     res.status(200).json({ tables });
//   } catch (error) {
//     res.status(500).json({ error: "DB Error" });
//   }
// }
// ✅ Updated /pages/api/tables.ts to return tables from all active databases for the user



// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";
// import { pool } from "@/lib/db";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { userId } = req.query;

//   if (!userId) {
//     return res.status(400).json({ error: "Missing userId in request." });
//   }

//   try {
//     // Get user's managed databases
//     const [rows] = await pool.query("SELECT managed_dbs FROM users WHERE userId = ?", [userId]);
//     const userRow = (rows as any[])[0];

//     if (!userRow || !userRow.managed_dbs) {
//       return res.status(400).json({ error: "No managed_dbs found for user." });
//     }

//     const managedDbs = userRow.managed_dbs;
//     const activeDbs = managedDbs.filter((db: any) => db.isActive);

//     if (activeDbs.length === 0) {
//       return res.status(400).json({ error: "No active databases for user." });
//     }

//     const allTables: { db: string; table: string }[] = [];

//     for (const db of activeDbs) {
//       const connection = await mysql.createConnection({
//         host: db.host,
//         user: db.db_username,
//         password: db.db_password,
//         port: parseInt(db.port),
//         database: db.db_name,
//       });

//       const [tables]: [any[], any] = await connection.query(`SHOW TABLES`);
//       await connection.end();

//       const tableKey = `Tables_in_${db.db_name}`;

//       for (const row of tables) {
//         allTables.push({ db: db.db_name, table: row[tableKey] });
//       }
//     }

//     res.status(200).json({ tables: allTables });
//   } catch (error) {
//     console.error("Error loading tables:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// }



import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import { pool } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in request." });
  }

  try {
    const [rows] = await pool.query("SELECT managed_dbs FROM users WHERE userId = ?", [userId]);
    const userRow = (rows as any[])[0];

    if (!userRow || !userRow.managed_dbs) {
      return res.status(400).json({ error: "No managed_dbs found for user." });
    }

    // ✅ Always parse manually (safe for all users like kruti, patil)
    const managedDbs = typeof userRow.managed_dbs === 'string'
      ? JSON.parse(userRow.managed_dbs)
      : userRow.managed_dbs;

    const activeDbs = managedDbs.filter((db: any) => db.isActive);

    if (activeDbs.length === 0) {
      return res.status(400).json({ error: "No active databases for user." });
    }

    const allTables: { db: string; table: string }[] = [];

  
     
    for (const db of activeDbs) {
      const connection = await mysql.createConnection({
        host: db.host,
        user: db.db_username,
        password: db.db_password,
        port: parseInt(db.port),
        database: db.db_name,
      });

      const [tables]: [any[], any] = await connection.query(`SHOW TABLES`);
      await connection.end();

      const tableKey = `Tables_in_${db.db_name}`;

      for (const row of tables) {
        allTables.push({ db: db.db_name, table: row[tableKey] });
      }
    }

    res.status(200).json({ tables: allTables });
  } catch (error) {
    console.error("Error loading tables:", error);
    res.status(500).json({ error: "Server error" });
  }
}



