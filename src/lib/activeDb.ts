import { pool } from "@/lib/db";

export async function getActiveDatabaseForUser(userId: string) {
  try {
    const [rows] = await pool.query(
      "SELECT managed_dbs FROM users WHERE userId = ?",
      [userId]
    );

    console.log("ROWS RETURNED FROM DB:", rows);

    const userRow = (rows as any[])[0];
    if (!userRow || !userRow.managed_dbs) {
      console.log("NO userRow OR NO managed_dbs FOUND");
      return null;
    }

    console.log("RAW managed_dbs JSON STRING:", userRow.managed_dbs);

    let managedDbs;
    try {
      managedDbs = JSON.parse(userRow.managed_dbs);
    } catch (e) {
      console.log("FAILED TO PARSE managed_dbs JSON", e);
      return null;
    }

    console.log("PARSED managedDbs ARRAY:", managedDbs);

    const activeDb = managedDbs.find((db: any) => db.isActive === true);

    console.log("ACTIVE DB FOUND:", activeDb);

    if (!activeDb) {
      console.log("NO activeDb in managedDbs");
      return null;
    }

    return activeDb;
  } catch (error) {
    console.error("ERROR in getActiveDatabaseForUser", error);
    return null;
  }
}
