import type { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const connection = await mysql.createConnection({
      host: `${process.env.MYSQLHOST}`,
      user: `${process.env.MYSQLUSER}`,
      password: `${process.env.MYSQLPASSWORD}`,
      database: 'client1_db', // Change as per your schema
    });

    const [rows] = await connection.execute('SELECT * FROM customers'); // Change table if needed
    await connection.end();

    res.status(200).json({ rows });
  } catch (error: any) {
    console.error("DB Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
