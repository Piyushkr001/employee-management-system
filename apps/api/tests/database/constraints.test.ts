import { expect, test, describe, beforeAll, afterAll, beforeEach } from "bun:test";
import { setupTestDatabase, cleanTestDatabase, closeTestDatabase } from "./setup";
import { createTestEmployee } from "./fixtures";
import { testDb } from "./test-db";
import { employees } from "../../src/db/schema";
import postgres from "postgres";

describe("Database Constraints", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  test("should reject negative salary", async () => {
    const promise = createTestEmployee({ salaryInPaise: -1000 });
    await expect(promise).rejects.toThrow();
    const err = await promise.catch(e => e) as postgres.PostgresError;
    expect(["23514", "23505", "23503"]).toContain(err.code);
  });

  test("should reject self-manager", async () => {
    const { eq } = require("drizzle-orm");
    const emp = await createTestEmployee();
    const promise = testDb.update(employees).set({ managerId: emp.id }).where(eq(employees.id, emp.id)).returning();
    await expect(promise).rejects.toThrow();
    const err = await promise.catch(e => e) as postgres.PostgresError;
    expect(["23514", "23505", "23503"]).toContain(err.code);
  });

  test("should reject invalid manager foreign key", async () => {
    const promise = createTestEmployee({ managerId: "00000000-0000-0000-0000-000000000000" });
    await expect(promise).rejects.toThrow();
    const err = await promise.catch(e => e) as postgres.PostgresError;
    expect(err.code).toBe("23503");
  });

  test("should reject duplicate email", async () => {
    const emp1 = await createTestEmployee({ email: "duplicate@empnexa.com" });
    const promise = createTestEmployee({ email: "duplicate@empnexa.com" });
    await expect(promise).rejects.toThrow();
    const err = await promise.catch(e => e) as postgres.PostgresError;
    expect(err.code).toBe("23505");
  });

  test("should reject duplicate employee code", async () => {
    const emp1 = await createTestEmployee({ employeeCode: "EMP-DUP" });
    const promise = createTestEmployee({ employeeCode: "EMP-DUP" });
    await expect(promise).rejects.toThrow();
    const err = await promise.catch(e => e) as postgres.PostgresError;
    expect(err.code).toBe("23505");
  });
});
