import type { NextApiRequest, NextApiResponse } from "next";
import { configPool } from "@/lib/db";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).end();

  const { id } = req.query;

  try {
    // first, delete from MySQL
    const [result] = await configPool.query(
      "DELETE FROM tenants WHERE id = ?",
      [id]
    );

    if ((result as any).affectedRows === 0) {
      return res.status(404).json({ message: "Config not found" });
    }

    // next, delete from config.json
    const filePath = path.join(process.cwd(), "config.json");

    if (fs.existsSync(filePath)) {
      const existing = JSON.parse(fs.readFileSync(filePath, "utf8"));
      // match on tenant_id rather than id if needed
      const updated = existing.filter((entry: any) => entry.tenant_id !== id);
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    }

    res.status(200).json({ message: "Config deleted successfully" });
  } catch (error) {
    console.error("Delete Config API Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
}




// import { configPool } from "@/lib/db";
// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "DELETE") return res.status(405).end();

//   const id = req.query.id;

//   try {
//     await configPool.query("DELETE FROM tenants WHERE id = ?", [id]);
//     res.status(200).json({ success: true });
//   } catch (err) {
//     console.error("Delete API error:", err);
//     res.status(500).json({ success: false });
//   }
// }





// // src/pages/api/delete-config.ts

// import type { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";
// import { pool } from "@/lib/db";  // adjust if your pool lives elsewhere

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "DELETE") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   const { tenant_id } = req.body;

//   if (!tenant_id) {
//     return res.status(400).json({ message: "tenant_id is required" });
//   }

//   try {
//     const [result] = await pool.query(
//       "DELETE FROM tenants WHERE tenant_id = ?",
//       [tenant_id]
//     );

//     return res.status(200).json({ success: true, message: "Config deleted successfully" });
//   } catch (error) {
//     console.error("Delete config error:", error);
//     return res.status(500).json({ success: false, message: "Failed to delete config" });
//   }
// }
