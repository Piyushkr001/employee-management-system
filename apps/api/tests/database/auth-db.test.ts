import { expect, test, describe, beforeAll, afterAll, beforeEach } from "bun:test";
import { setupTestDatabase, cleanTestDatabase, closeTestDatabase } from "./setup";
import { createTestEmployee } from "./fixtures";
import { AuthRepository } from "../../src/modules/auth/auth.repository";

describe("Authentication DB Logic", () => {
  const repo = new AuthRepository();

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  test("login query should exclude salaryInPaise but include passwordHash", async () => {
    const emp = await createTestEmployee();
    
    const loginData = await repo.findEmployeeForLoginByEmail(emp.email);
    expect(loginData).toBeDefined();
    if (loginData) {
      expect(loginData.passwordHash).toBeDefined();
      expect((loginData as any).salaryInPaise).toBeUndefined();
    }
  });

  test("profile query should exclude passwordHash", async () => {
    const emp = await createTestEmployee();
    
    const profile = await repo.findFullEmployeeById(emp.id);
    expect(profile).toBeDefined();
    if (profile) {
      expect((profile as any).passwordHash).toBeUndefined();
    }
  });

  test("should not return soft-deleted employees for login", async () => {
    const emp = await createTestEmployee();
    
    // Manual soft delete for test
    const { testDb } = await import("./test-db");
    const { employees } = await import("../../src/db/schema");
    const { eq } = await import("drizzle-orm");
    await testDb.update(employees).set({ deletedAt: new Date() }).where(eq(employees.id, emp.id));

    const loginData = await repo.findEmployeeForLoginByEmail(emp.email);
    expect(loginData).toBeUndefined();
  });

  test("should not return soft-deleted employees for identity check", async () => {
    const emp = await createTestEmployee();
    
    const { testDb } = await import("./test-db");
    const { employees } = await import("../../src/db/schema");
    const { eq } = await import("drizzle-orm");
    await testDb.update(employees).set({ deletedAt: new Date() }).where(eq(employees.id, emp.id));

    const identity = await repo.findEmployeeIdentityById(emp.id);
    expect(identity).toBeUndefined();
  });
});
