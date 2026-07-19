import { migrate } from "drizzle-orm/postgres-js/migrator";
import { testClient, testDb } from "./test-db";
import { assertSafeTestDatabase } from "./database-safety";
import { employees } from "../../src/db/schema";

export async function setupTestDatabase(): Promise<void> {
  assertSafeTestDatabase();

  await migrate(testDb, {
    migrationsFolder: "./drizzle",
  });
}

export async function cleanTestDatabase(): Promise<void> {
  assertSafeTestDatabase();

  // Clear employees table
  await testDb.delete(employees);
}

export async function closeTestDatabase(): Promise<void> {
  // Let Bun naturally close the connection to avoid killing shared module connection across concurrent test files
}
