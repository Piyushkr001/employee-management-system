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
  const normalParsed = normalDatabaseUrl ? new URL(normalDatabaseUrl) : null;

  if (normalParsed) {
    const effectiveTestPort = parsed.port || "5432";
    const effectiveNormalPort = normalParsed.port || "5432";
    const normalizedTestDbName = parsed.pathname.replace(/^\/+/, "").toLowerCase();
    const normalizedNormalDbName = normalParsed.pathname.replace(/^\/+/, "").toLowerCase();

    if (
      parsed.hostname.toLowerCase() === normalParsed.hostname.toLowerCase() &&
      effectiveTestPort === effectiveNormalPort &&
      normalizedTestDbName === normalizedNormalDbName
    ) {
      throw new Error("Refusing to run tests because TEST_DATABASE_URL connects to the same DB as DATABASE_URL");
    }
  }

  const databaseName = parsed.pathname.replace(/^\//, "").toLowerCase();

  const isSafeTestName = /(^|[_-])test($|[_-])/.test(databaseName);
  if (!isSafeTestName) {
    throw new Error("Refusing to run destructive database tests against a database whose name is not explicitly marked as test");
  }

  if (process.env.NODE_ENV !== "test") {
    throw new Error("Database tests require NODE_ENV=test");
  }
}
