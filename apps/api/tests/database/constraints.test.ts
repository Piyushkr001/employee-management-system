import { expect, test, describe, beforeAll, afterAll, beforeEach } from "bun:test";
import { setupTestDatabase, cleanTestDatabase, closeTestDatabase } from "./setup";
import { createTestEmployee } from "./fixtures";
import { testDb } from "./test-db";
import { employees } from "../../src/db/schema";
import postgres from "postgres";
import { unwrapPostgreSqlError } from "../../src/utils/database-error";

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
    try {
      await createTestEmployee({ salaryInPaise: -1000 });
      throw new Error("Expected operation to fail");
    } catch (error) {
      const postgresError = unwrapPostgreSqlError(error);
      expect(postgresError?.code).toBe("23514");
      expect(postgresError?.constraint).toBe("employees_salary_non_negative");
    }
  });

  test("should reject self-manager", async () => {
    const { eq } = require("drizzle-orm");
    const emp = await createTestEmployee();
    try {
      const promise = testDb.update(employees).set({ managerId: emp.id }).where(eq(employees.id, emp.id)).returning();
      await promise;
      throw new Error("Expected operation to fail");
    } catch (error) {
      const postgresError = unwrapPostgreSqlError(error);
      expect(postgresError?.code).toBe("23514");
      expect(postgresError?.constraint).toBe("employees_manager_not_self");
    }
  });

  test("should reject invalid manager foreign key", async () => {
    try {
      await createTestEmployee({ managerId: "00000000-0000-0000-0000-000000000000" });
      throw new Error("Expected operation to fail");
    } catch (error) {
      const postgresError = unwrapPostgreSqlError(error);
      expect(postgresError?.code).toBe("23503");
      expect(postgresError?.constraint).toBe("employees_manager_id_employees_id_fk");
    }
  });

  test("should reject duplicate email", async () => {
    await createTestEmployee({ email: "duplicate@empnexa.com" });
    try {
      await createTestEmployee({ email: "duplicate@empnexa.com" });
      throw new Error("Expected operation to fail");
    } catch (error) {
      const postgresError = unwrapPostgreSqlError(error);
      expect(postgresError?.code).toBe("23505");
      expect(postgresError?.constraint).toBe("employees_email_unique");
    }
  });

  test("should reject duplicate employee code", async () => {
    await createTestEmployee({ employeeCode: "EMP-DUP" });
    try {
      await createTestEmployee({ employeeCode: "EMP-DUP" });
      throw new Error("Expected operation to fail");
    } catch (error) {
      const postgresError = unwrapPostgreSqlError(error);
      expect(postgresError?.code).toBe("23505");
      expect(postgresError?.constraint).toBe("employees_employee_code_unique");
    }
  });
});
