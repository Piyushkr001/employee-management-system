import { migrate } from "drizzle-orm/postgres-js/migrator";
import { testClient, testDb } from "./test-db";
import { assertSafeTestDatabase } from "./database-safety";
import { employees } from "../../src/db/schema";

let isMigrated = false;

export async function setupTestDatabase(): Promise<void> {
  if (isMigrated) return;
  assertSafeTestDatabase();

  await migrate(testDb, {
    migrationsFolder: "./drizzle",
  });
  isMigrated = true;
}

export async function cleanTestDatabase(): Promise<void> {
  assertSafeTestDatabase();

  // Clear employees table
  await testDb.delete(employees);
}

export async function closeTestDatabase(): Promise<void> {
  // Let the test runner handle connection closure
}
