import { expect, test, describe, beforeAll, afterAll, beforeEach } from "bun:test";
import { setupTestDatabase, cleanTestDatabase, closeTestDatabase } from "./setup";
import { createActiveSuperAdmin, createTestEmployee } from "./fixtures";
import { EmployeeRepository } from "../../src/modules/employees/employee.repository";

describe("Soft Delete Integrity", () => {
  const repo = new EmployeeRepository();

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  test("should allow deleting an employee with no reportees", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    const emp = await createTestEmployee();
    
    const deleted = await repo.softDelete(emp.id, actor);
    expect(deleted.deletedAt).toBeDefined();

    const fetched = await repo.findById(emp.id);
    expect(fetched).toBeUndefined(); // Returns undefined because of isNull(deletedAt)
  });

  test("should reject deleting a manager with direct reportees", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    const manager = await createTestEmployee();
    const reportee = await createTestEmployee({ managerId: manager.id });

    await expect(
      repo.softDelete(manager.id, actor)
    ).rejects.toThrow("Reassign direct reportees before deleting this employee");
  });

  test("concurrent manager deletion vs employee creation", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    const manager = await createTestEmployee();
    
    // Concurrent attempt to create reportee while deleting manager
    const attempt1 = repo.createEmployeeTransactionSafe({
      employeeCode: "EMP-CONC",
      name: "Test",
      email: "conc@test.com",
      passwordHash: "hash",
      phone: "123",
      department: "Dept",
      designation: "Desig",
      salaryInPaise: 1000,
      joiningDate: "2026-01-01",
      status: "active",
      role: "employee",
      managerId: manager.id
    }, actor);

    const attempt2 = repo.softDelete(manager.id, actor);

    const results = await Promise.allSettled([attempt1, attempt2]);
    
    // Either the creation succeeds and deletion fails (due to reportee), 
    // OR deletion succeeds and creation fails (due to invalid manager).
    // Both cannot succeed.
    
    const succeeded = results.filter(r => r.status === "fulfilled");
    const failed = results.filter(r => r.status === "rejected");
    
    expect(succeeded.length).toBe(1);
    expect(failed.length).toBe(1);

    // Verify DB state
    const { testDb } = require("./test-db");
    const { employees } = require("../../src/db/schema/employees");
    const { eq } = require("drizzle-orm");

    const createdEmployee = await testDb.query.employees.findFirst({
      where: eq(employees.email, "conc@test.com"),
    });

    if (createdEmployee?.managerId) {
      const dbManager = await testDb.query.employees.findFirst({
        where: eq(employees.id, createdEmployee.managerId),
      });

      expect(dbManager).toBeDefined();
      expect(dbManager?.deletedAt).toBeNull();
      expect(dbManager?.status).toBe("active");
    }
  }, 10000);

  test("concurrent update vs employee deletion", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    const emp = await createTestEmployee();

    // Concurrent attempt to update employee while deleting it
    const attempt1 = repo.updateEmployeeTransactionSafe(emp.id, { phone: "999999999" }, actor);
    const attempt2 = repo.softDelete(emp.id, actor);

    const results = await Promise.allSettled([attempt1, attempt2]);
    
    const succeeded = results.filter(r => r.status === "fulfilled");
    const failed = results.filter(r => r.status === "rejected");

    // Only one outcome is valid:
    // If delete wins first, update throws EMPLOYEE_NOT_FOUND
    // If update wins first, delete succeeds afterwards.
    // In BOTH valid scenarios, the final row MUST be deleted.

    const { testDb } = require("./test-db");
    const { employees } = require("../../src/db/schema/employees");
    const { eq } = require("drizzle-orm");

    const finalRow = await testDb.query.employees.findFirst({
      where: eq(employees.id, emp.id),
    });

    expect(finalRow).toBeDefined();
    expect(finalRow?.deletedAt).not.toBeNull();
  }, 10000);

  test("should prevent update to deleted employee", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    const emp = await createTestEmployee();

    await repo.softDelete(emp.id, actor);

    await expect(
      repo.updateEmployeeTransactionSafe(emp.id, { phone: "999999999" }, actor)
    ).rejects.toThrow("Employee not found");
  });

  test("repeated delete returns 404", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    const emp = await createTestEmployee();

    await repo.softDelete(emp.id, actor);

    await expect(
      repo.softDelete(emp.id, actor)
    ).rejects.toThrow("Employee not found");
  });
});
