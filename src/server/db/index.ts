import { drizzle } from "drizzle-orm/singlestore";
import { createPool, type Pool } from "mysql2/promise";

import { env } from "~/env";
import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: Pool | undefined;
};

const conn: Pool =
  globalForDb.conn ??
  createPool({
    host: env.SINGLESTORE_HOST,
    port: parseInt(env.SINGLESTORE_PORT),
    user: env.SINGLESTORE_USER,
    password: env.SINGLESTORE_PASS,
    database: env.SINGLESTORE_DB_NAME,
    ssl: {},
    maxIdle: 0,
  });

if (env.NODE_ENV !== "production") globalForDb.conn = conn;

conn.addListener("error", (err: Error) => {
  console.error("Database connection error:", err);
});

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const db = drizzle(conn, { schema });
