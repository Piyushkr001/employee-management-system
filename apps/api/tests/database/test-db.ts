import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../src/db/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (!testDatabaseUrl) {
  throw new Error("TEST_DATABASE_URL is required for database tests");
}

const normalDatabaseUrl = process.env.DATABASE_URL;
const normalizedTestUrl = testDatabaseUrl.trim().toLowerCase();
const normalizedNormalUrl = normalDatabaseUrl?.trim().toLowerCase();

if (normalizedNormalUrl && normalizedTestUrl === normalizedNormalUrl) {
  throw new Error("TEST_DATABASE_URL must not equal DATABASE_URL");
}

export const testClient = postgres(testDatabaseUrl, {
  max: 1,
  prepare: false,
});

export const testDb = drizzle(testClient, {
  schema,
});
