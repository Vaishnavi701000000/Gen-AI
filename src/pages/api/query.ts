
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt } = req.body;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are an assistant that only returns SQL queries with no explanation.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const result = await response.json();
  const sql = result.choices?.[0]?.message?.content ?? "SQL not generated";

  res.status(200).json({ sql });
}



// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { prompt } = req.body;

//   // Schema context added for better query generation
//   const schemaContext = `
// You are an AI assistant that generates SQL queries only (no explanation).
// The database has the following schema:

// Table: employees
// - id (INT, Primary Key)
// - name (VARCHAR)
// - salary (DECIMAL)
// - city (VARCHAR)

// Table: employees_address
// - id (INT, Primary Key)
// - address (VARCHAR)
// - empId (INT, Foreign Key to employees.id)

// Use correct column names and JOIN logic.
// `;

//   const fullPrompt = `${schemaContext}\n\nNow write a SQL query for: "${prompt}"`;

//   const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//     },
//     body: JSON.stringify({
//       model: "llama3-70b-8192",
//       messages: [
//         {
//           role: "system",
//           content: "You are an assistant that only returns SQL queries with no explanation.",
//         },
//         {
//           role: "user",
//           content: fullPrompt,
//         },
//       ],
//     }),
//   });

//   const result = await response.json();
//   const sql = result.choices?.[0]?.message?.content ?? "SQL not generated";

//   res.status(200).json({ sql });
// }


// import { NextApiRequest, NextApiResponse } from "next";
// import mysql from "mysql2/promise";
// import { pool } from "@/lib/db";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { prompt, userId } = req.body;

//   if (!userId || !prompt) {
//     return res.status(400).json({ message: "Missing prompt or userId" });
//   }

//   try {
//     const [rows] = await pool.query("SELECT managed_dbs FROM users WHERE userId = ?", [userId]);
//     const userRow = (rows as any[])[0];
//     if (!userRow || !userRow.managed_dbs) {
//       return res.status(400).json({ message: "No managed_dbs found for user." });
//     }

//     const managedDbs = userRow.managed_dbs;
//     const activeDb = managedDbs.find((db: any) => db.isActive === true);
//     if (!activeDb) {
//       return res.status(400).json({ message: "No active database selected." });
//     }

//     // Connect to the user's active DB
//     const connection = await mysql.createConnection({
//       host: activeDb.host,
//       user: activeDb.db_username,
//       password: activeDb.db_password,
//       port: parseInt(activeDb.port),
//       database: activeDb.db_name,
//     });

//     // 📌 Fetch tables and columns
//     const [tableRows]: any = await connection.query(`
//       SELECT table_name, column_name 
//       FROM information_schema.columns 
//       WHERE table_schema = ?
//     `, [activeDb.db_name]);

//     await connection.end();

//     // 📦 Organize into a helpful string
//     const schemaInfo = tableRows.reduce((acc: any, row: any) => {
//       acc[row.table_name] = acc[row.table_name] || [];
//       acc[row.table_name].push(row.column_name);
//       return acc;
//     }, {});

//     let schemaString = Object.entries(schemaInfo).map(
//       ([table, columns]: any) => `${table}(${columns.join(", ")})`
//     ).join("; ");

//     // 🧠 Send schema along with prompt to Groq
//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "llama3-70b-8192",
//         messages: [
//           {
//             role: "system",
//             content: `You are an assistant that only returns SQL queries with no explanation. Use only these tables:\n\n${schemaString}`,
//           },
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//       }),
//     });

//     const result = await response.json();
//     const sql = result.choices?.[0]?.message?.content ?? "SQL not generated";

//     res.status(200).json({ sql });
//   } catch (error: any) {
//     console.error("Error in query.ts:", error);
//     res.status(500).json({ message: error.message || "Server error" });
//   }
// }
