// // pages/api/config-db-list.ts
// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   try {
//     const connection = await mysql.createConnection({
//       host: "localhost",
//       user: "root",
//       password: "Ramyam01",  // change this
//       database: "config_db",            // this is your config DB
//     });

//     const [rows] = await connection.execute("SELECT tenant_id, host, user, database FROM tenants");
//     res.status(200).json({ tenants: rows });
//   } catch (error) {
//     console.error("Error loading tenants:", error);
//     res.status(500).json({ error: "Failed to load tenant list" });
//   }
// }
import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST || "localhost",
      user: process.env.MYSQLUSER || "root",
      password: process.env.MYSQLPASSWORD || "Ramyam01",
      database: process.env.CONFIG_DB_NAME || "config_db",
    });

    // ✅ Select all relevant fields matching your updated schema
    const [rows] = await connection.execute(`
      SELECT 
        id,
        tenant_id,
        host,
        port,
        db_username,
        db_pwd,
        db_name,
        isActive,
        created_date,
        modified_date
      FROM tenants
      ORDER BY created_date DESC
    `);

    res.status(200).json({
      success: true,
      tenants: rows,
      count: Array.isArray(rows) ? rows.length : 0,
    });

  } catch (error: any) {
    console.error("Database error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to load tenant configurations",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  } finally {
    if (connection) await connection.end();
  }
}
