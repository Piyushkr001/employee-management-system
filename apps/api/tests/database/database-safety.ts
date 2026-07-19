export function assertSafeTestDatabase(): void {
  const testDatabaseUrl = process.env.TEST_DATABASE_URL;
  const normalDatabaseUrl = process.env.DATABASE_URL;

  if (!testDatabaseUrl) {
    throw new Error("TEST_DATABASE_URL is missing");
  }

  if (normalDatabaseUrl && testDatabaseUrl === normalDatabaseUrl) {
    throw new Error("Refusing to run tests because TEST_DATABASE_URL equals DATABASE_URL");
  }

  const parsed = new URL(testDatabaseUrl);
  const databaseName = parsed.pathname.replace(/^\//, "").toLowerCase();

  if (!databaseName.includes("test")) {
    throw new Error("Refusing to run destructive database tests because the database name does not contain 'test'");
  }

  if (process.env.NODE_ENV !== "test") {
    throw new Error("Database tests require NODE_ENV=test");
  }
}
