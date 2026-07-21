import { expect, test, describe, beforeAll, afterAll, beforeEach } from "bun:test";
import { setupTestDatabase, cleanTestDatabase, closeTestDatabase } from "./setup";
import { createActiveSuperAdmin, createHrManager, createTestEmployee } from "./fixtures";
import { EmployeeRepository } from "../../src/modules/employees/employee.repository";

describe("Transactional Creation", () => {
  const repo = new EmployeeRepository();

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  test("should rollback creation if manager does not exist", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    const promise = repo.createEmployeeTransactionSafe({
      employeeCode: "EMP-ROLL",
      name: "Test",
      email: "roll@test.com",
      passwordHash: "hash",
      phone: "123",
      department: "Dept",
      designation: "Desig",
      salaryInPaise: 1000,
      joiningDate: "2026-01-01",
      status: "active",
      role: "employee",
      managerId: "00000000-0000-0000-0000-000000000000"
    }, actor);
    
    await expect(promise).rejects.toThrow("Selected manager does not exist");
    
    // Ensure no partial insert
    const emp = await repo.findByEmail("roll@test.com");
    expect(emp).toBeUndefined();
  });

  test("should rollback creation if manager is inactive", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    const manager = await createTestEmployee({ status: "inactive" });

    const promise = repo.createEmployeeTransactionSafe({
      employeeCode: "EMP-ROLL2",
      name: "Test",
      email: "roll2@test.com",
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

    await expect(promise).rejects.toThrow("Selected manager is inactive");
  });

  test("should rollback creation if manager is soft-deleted", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    const manager = await createTestEmployee();
    await repo.softDelete(manager.id, actor);

    const promise = repo.createEmployeeTransactionSafe({
      employeeCode: "EMP-ROLL3",
      name: "Test",
      email: "roll3@test.com",
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

    await expect(promise).rejects.toThrow("Selected manager is inactive");
  });

  test("should successfully create employee with active manager", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    const manager = await createTestEmployee({ status: "active" });

    const emp = await repo.createEmployeeTransactionSafe({
      employeeCode: "EMP-OK",
      name: "Test",
      email: "ok@test.com",
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

    expect(emp.managerId).toBe(manager.id);
  });
});
