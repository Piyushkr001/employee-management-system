import { expect, test, describe, beforeAll, afterAll, beforeEach } from "bun:test";
import { setupTestDatabase, cleanTestDatabase, closeTestDatabase } from "./setup";
import { createActiveSuperAdmin, createTestEmployee } from "./fixtures";
import { EmployeeRepository } from "../../src/modules/employees/employee.repository";

describe("Soft Delete Integrity", () => {
  const repo = new EmployeeRepository();

  beforeAll(async () => {
    await setupTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  test("should allow deleting an employee with no reportees", async () => {
    const emp = await createTestEmployee();
    
    const deleted = await repo.softDelete(emp.id);
    expect(deleted.deletedAt).toBeDefined();

    const fetched = await repo.findById(emp.id);
    expect(fetched).toBeUndefined(); // Returns undefined because of isNull(deletedAt)
  });

  test("should reject deleting a manager with direct reportees", async () => {
    const manager = await createTestEmployee();
    const reportee = await createTestEmployee({ managerId: manager.id });

    await expect(
      repo.softDelete(manager.id)
    ).rejects.toThrow("Reassign direct reportees before deleting this employee");
  });

  test("concurrent manager deletion vs employee creation", async () => {
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
    });

    const attempt2 = repo.softDelete(manager.id);

    const results = await Promise.allSettled([attempt1, attempt2]);
    
    // Either the creation succeeds and deletion fails (due to reportee), 
    // OR deletion succeeds and creation fails (due to invalid manager).
    // Both cannot succeed.
    
    const succeeded = results.filter(r => r.status === "fulfilled");
    const failed = results.filter(r => r.status === "rejected");
    
    if (succeeded.length !== 1) {
      console.log("Failed reasons:", failed.map((f: any) => f.reason));
    }
    
    expect(succeeded.length).toBe(1);
    expect(failed.length).toBe(1);
  }, 10000);
});
