// pages/api/utils.ts
import mysql from "mysql2/promise";

// Dummy example - you should fetch from config_db.tenants
export const getTenantConfig = async (tenantId: string) => {
  // You could fetch from config_db here
  // For now, let's hardcode for example
  if (tenantId === "client1") {
    return {
      host: "localhost",
      user: "root",
      password: "Ramyam01",
      database: "client1_db",
    };
  } else if (tenantId === "client2") {
    return {
      host: "localhost",
      user: "root",
      password: "Ramyam01",
      database: "client2_db",
    };
  }

  throw new Error("Tenant not found");
};
