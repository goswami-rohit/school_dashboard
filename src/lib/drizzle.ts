// src/lib/drizzle.ts
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../../drizzle";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
	throw new Error("DATABASE_URL must be set.");
}

const globalForDb = globalThis as unknown as {
	__PG_POOL__?: Pool;
	__DRIZZLE_DB__?: ReturnType<typeof drizzle<typeof schema>>;
};

const pool =
	globalForDb.__PG_POOL__ ??
	new Pool({
		connectionString: DATABASE_URL,
		max: 10,
		idleTimeoutMillis: 30_000,
		connectionTimeoutMillis: 10_000,
	});

const db = globalForDb.__DRIZZLE_DB__ ?? drizzle(pool, { schema });

if (process.env.NODE_ENV !== "production") {
	globalForDb.__PG_POOL__ = pool;
	globalForDb.__DRIZZLE_DB__ = db;
}

export { db, pool, schema };
