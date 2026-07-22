import { expect, test, describe, beforeAll, afterAll, beforeEach } from "bun:test";
import { setupTestDatabase, cleanTestDatabase, closeTestDatabase } from "./setup";
import { createActiveSuperAdmin, createTestEmployee } from "./fixtures";
import { EmployeeRepository } from "../../src/modules/employees/employee.repository";

describe("Hierarchy Constraints", () => {
  const repo = new EmployeeRepository();

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  test("should prevent direct self-management via update", async () => {
    const admin = await createActiveSuperAdmin();
    const emp = await createTestEmployee();

    const actor = { id: admin.id, role: admin.role };

    await expect(
      repo.updateEmployeeTransactionSafe(emp.id, { managerId: emp.id }, actor)
    ).rejects.toThrow("Employee cannot manage themselves");
  });

  test("should prevent indirect circular reporting (A -> B -> C -> A)", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };

    const empA = await createTestEmployee();
    const empB = await createTestEmployee({ managerId: empA.id });
    const empC = await createTestEmployee({ managerId: empB.id });

    // Attempt to make A report to C
    await expect(
      repo.updateEmployeeTransactionSafe(empA.id, { managerId: empC.id }, actor)
    ).rejects.toThrow("Circular reporting structure detected");
  });

  test("should allow valid hierarchy reassignment", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };

    const empA = await createTestEmployee();
    const empB = await createTestEmployee({ managerId: empA.id });
    const empC = await createTestEmployee({ managerId: empB.id });

    // C reports to A directly
    const res = await repo.updateEmployeeTransactionSafe(empC.id, { managerId: empA.id }, actor);
    expect(res.employee.managerId).toBe(empA.id);
  });
});
