import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  // Cloud databases (DigitalOcean, Supabase, Neon) use custom/self-signed SSL certificates.
  // rejectUnauthorized: false prevents "self-signed certificate in certificate chain" errors.
  const requiresSsl =
    connectionString?.includes("sslmode=require") ||
    connectionString?.includes("ondigitalocean.com") ||
    connectionString?.includes("sslmode=");

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString,
      ssl: requiresSsl ? { rejectUnauthorized: false } : undefined,
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pgPool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
