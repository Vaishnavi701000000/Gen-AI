import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host:process.env.MYSQLHOST,
  port: process.env.MYSQLPORT ? parseInt(process.env.MYSQLPORT) : 3306,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE   // ✅ ensure this is quickquery_auth
});
