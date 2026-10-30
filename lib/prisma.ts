process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

const createPrismaClient = () => {
  const rawConnectionString = process.env.DATABASE_URL;

  // Cloud databases (DigitalOcean, Supabase, Neon) use custom/self-signed SSL certificates.
  // Note: pg-connection-string parses `sslmode=require` as verify-full and strips rejectUnauthorized: false.
  // We strip sslmode from the pool connection string so pg uses ssl: { rejectUnauthorized: false }.
  const requiresSsl =
    rawConnectionString?.includes("sslmode=require") ||
    rawConnectionString?.includes("ondigitalocean.com") ||
    rawConnectionString?.includes("sslmode=");

  let cleanConnectionString = rawConnectionString;
  if (requiresSsl && cleanConnectionString) {
    try {
      const url = new URL(cleanConnectionString);
      url.searchParams.delete("sslmode");
      url.searchParams.delete("sslaccept");
      cleanConnectionString = url.toString();
    } catch {
      cleanConnectionString = cleanConnectionString
        .replace(/([?&])sslmode=[^&]+(&|$)/, "$1")
        .replace(/([?&])sslaccept=[^&]+(&|$)/, "$1")
        .replace(/[?&]$/, "");
    }
  }

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString: cleanConnectionString,
      ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
      max: process.env.NODE_ENV === "production" ? 4 : 2, // Low connection ceiling for DigitalOcean cluster limits
      idleTimeoutMillis: 1500, // Quickly return idle connections to prevent exhausting DO pool slots
      connectionTimeoutMillis: 6000,
      allowExitOnIdle: true,
    });

  // Critical for node-postgres: prevents uncaught EventEmitter crashes when idle connections close
  pool.on("error", (err) => {
    console.warn("PostgreSQL pool client notice (handled):", err?.message || err);
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

export default prisma;
