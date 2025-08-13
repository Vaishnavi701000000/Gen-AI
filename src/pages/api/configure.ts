// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";

// const CONFIG_DB = {
//   host: "localhost",
//   user: "root",
//   password: "your_mysql_password",
//   database: "config_db"
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const { tenant_id, host, user, password, database } = req.body;

//   if (!tenant_id || !host || !user || !password || !database) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     const conn = await mysql.createConnection(CONFIG_DB);

//     await conn.execute(
//       `INSERT INTO tenants (tenant_id, host, user, password, database_name) VALUES (?, ?, ?, ?, ?)`,
//       [tenant_id, host, user, password, database]
//     );

//     await conn.end();
//     return res.status(200).json({ message: "Configuration saved successfully." });
//   } catch (error: any) {
//     return res.status(500).json({ message: error.message });
//   }
// }
// pages/api/configure.ts

// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";

// const CONFIG_DB = {
//   host: "localhost",
//   user: "root",
//   password: "Ramyam01", // use correct one
//   database: "config_db",
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }

//   const {
//     tenant_id,
//     db_username,
//     db_pwd,
//     host,
//     port,
//     db_name,
//     isActive = false
//   } = req.body;

//   if (!tenant_id || !db_username || !db_pwd || !host || !port || !db_name) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     const conn = await mysql.createConnection(CONFIG_DB);

//     const [existing] = await conn.execute("SELECT * FROM tenants WHERE tenant_id = ?", [tenant_id]);
//     if ((existing as any[]).length > 0) {
//       return res.status(409).json({ message: "Tenant already exists." });
//     }

//     await conn.execute(
//       `INSERT INTO tenants 
//         (tenant_id, db_username, db_pwd, host, port, db_name, isActive)
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [tenant_id, db_username, db_pwd, host, port, db_name, isActive ? 1 : 0]
//     );

//     await conn.end();

//     return res.status(200).json({ message: "Configuration saved successfully." });

//   } catch (error: any) {
//     console.error("Error saving config:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// }
import type { NextApiRequest, NextApiResponse } from "next";
// import { userPool } from "@/lib/db";
import { configPool } from "@/lib/db";

import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { tenant_id, db_username, db_pwd, host, port, db_name } = req.body;

  try {
    // store in MySQL
    await configPool.query(
      `INSERT INTO tenants (tenant_id, db_username, db_pwd, host, port, db_name, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, false)`,
      [tenant_id, db_username, db_pwd, host, port, db_name]
    );

    // also store in config.json
    const filePath = path.join(process.cwd(), "config.json");
    let existing: any[] = [];

    if (fs.existsSync(filePath)) {
      existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    existing.push({
      tenant_id,
      db_username,
      db_pwd,
      port,
      host,
      db_name,
      created_date: new Date().toISOString(),
      modified_date: new Date().toISOString(),
      isActive: false,
    });

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

    res.status(200).json({ message: "Config saved successfully" });
  } catch (error) {
    console.error("Configure API Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
