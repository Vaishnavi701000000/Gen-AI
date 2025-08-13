// /lib/getActiveDatabase.ts

// import { pool } from "./db";
// import type { RowDataPacket } from "mysql2";

// export async function getActiveDatabase(userId: string) {
//   try {
//     const [rows] = await pool.query<RowDataPacket[]>(
//       "SELECT managed_dbs FROM users WHERE userId = ?",
//       [userId]
//     );

//     if (!rows || rows.length === 0) return null;

//     // managed_dbs JSON is automatically parsed by MySQL
//     const managedDbs = rows[0].managed_dbs;

//     // find the active one
//     const activeDb = managedDbs.find((db: any) => db.isActive);

//     return activeDb || null;
//   } catch (err) {
//     console.error("getActiveDatabase error", err);
//     return null;
//   }
// }

// lib/getActiveDatabase.ts
import { pool } from "@/lib/db";

export type ManagedDb = {
  id?: string;
  label?: string;
  host: string;
  port: number;
  db_name?: string | null;
  db_username: string;
  db_password: string;
  isActive?: boolean;
};

export async function getActiveDatabase(userId: string): Promise<ManagedDb | null> {
  if (!userId) return null;

  try {
    const [rows] = await pool.query<any[]>(
      "SELECT managed_dbs FROM users WHERE userId = ?",
      [userId]
    );

    const userRow = rows && rows.length > 0 ? rows[0] : null;
    if (!userRow) return null;

    let managedDbs: ManagedDb[] = [];

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

    const active = managedDbs.find((d) => d.isActive === true) || null;

    if (!active) return null;

    // normalize defaults
    return {
      id: active.id,
      label: active.label,
      host: active.host,
      port: typeof active.port === "number" ? active.port : parseInt(String(active.port || 3306)),
      db_name: active.db_name || null,
      db_username: active.db_username,
      db_password: active.db_password,
      isActive: true,
    };
  } catch (err) {
    console.error("getActiveDatabase error:", err);
    return null;
  }
}
export default getActiveDatabase;

