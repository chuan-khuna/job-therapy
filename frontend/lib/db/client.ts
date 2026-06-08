import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/lib/generated/prisma/client";

// SQLite connection string, resolved relative to the project root (see .env).
const url = process.env.DATABASE_URL ?? "file:./db/job-therapy.sqlite";

// Reuse a single PrismaClient across hot reloads in dev — Next.js re-evaluates
// modules on every change, which would otherwise open a new DB handle each time.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaBetterSQLite3({ url }) });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
