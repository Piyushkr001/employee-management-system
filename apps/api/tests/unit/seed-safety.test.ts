import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { assertSafeSeedEnvironment } from "../../src/db/seed-safety";

describe("Seed Safety", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test("should block production seed without override", () => {
    expect(() => {
      assertSafeSeedEnvironment({
        nodeEnv: "production",
        allowDemoSeed: "false",
        databaseUrl: "postgres://user:pass@host/empnexa_prod",
      });
    }).toThrow("Refusing to seed demo data in production");
  });

  test("should allow production seed with explicit override", () => {
    expect(() => {
      assertSafeSeedEnvironment({
        nodeEnv: "production",
        allowDemoSeed: "true",
        databaseUrl: "postgres://user:pass@host/empnexa_prod",
      });
    }).not.toThrow();
  });

  test("should reject unsafe seed database name", () => {
    expect(() => {
      assertSafeSeedEnvironment({
        nodeEnv: "development",
        allowDemoSeed: "false",
        databaseUrl: "postgres://user:pass@host/empnexa_prod",
      });
    }).toThrow("Refusing to seed unsafe database: empnexa_prod");
  });

  test("should accept safe development database", () => {
    expect(() => {
      assertSafeSeedEnvironment({
        nodeEnv: "development",
        allowDemoSeed: "false",
        databaseUrl: "postgres://user:pass@host/empnexa_dev",
      });
    }).not.toThrow();
  });

  test("should accept safe test database", () => {
    expect(() => {
      assertSafeSeedEnvironment({
        nodeEnv: "test",
        allowDemoSeed: "false",
        databaseUrl: "postgres://user:pass@host/empnexa_test",
      });
    }).not.toThrow();
  });

  test("should reject missing DATABASE_URL", () => {
    expect(() => {
      assertSafeSeedEnvironment({
        nodeEnv: "development",
        allowDemoSeed: "false",
      });
    }).toThrow("DATABASE_URL is required");
  });

  test("should reject malformed DATABASE_URL", () => {
    expect(() => {
      assertSafeSeedEnvironment({
        nodeEnv: "development",
        allowDemoSeed: "false",
        databaseUrl: "not-a-url",
      });
    }).toThrow();
  });
});
