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
      max: 2, // Strictly throttled to prevent hitting DigitalOcean's concurrent connection cap
      idleTimeoutMillis: 3000, // Reclaim idle connection slots quickly (3 seconds)
      connectionTimeoutMillis: 10000,
      allowExitOnIdle: true,
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
