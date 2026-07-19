import { expect, test, describe, beforeEach } from "bun:test";
import "./setup";
import db from "../../src/db";
import { employees } from "../../src/db/schema/employees";
import { EmployeeRepository } from "../../src/modules/employees/employee.repository";
import { hashPassword } from "../../src/utils/password";
import { UserRole } from "@empnexa/shared";
import { ApiError } from "../../src/utils/api-error";

describe("Integration Database Tests", () => {
  const repo = new EmployeeRepository();

  beforeEach(async () => {
    await db.delete(employees);
  });

  test("should prevent demoting the last active super admin concurrently", async () => {
    const passwordHash = await hashPassword("Test@123");
    const superAdmin = await repo.createEmployeeTransactionSafe({
      employeeCode: "EMP999",
      name: "Last Super Admin",
      email: "lastadmin@test.com",
      passwordHash,
      phone: "+1234567890",
      department: "Admin",
      designation: "CEO",
      salaryInPaise: 1000000,
      joiningDate: "2026-01-01",
      status: "active",
      role: "super_admin",
    });

    const actor = { id: superAdmin.id, role: "super_admin" as UserRole };

    // Attempt to concurrently demote or deactivate
    const attempt1 = repo.updateEmployeeTransactionSafe(superAdmin.id, { role: "employee" }, actor);
    const attempt2 = repo.updateEmployeeTransactionSafe(superAdmin.id, { status: "inactive" }, actor);

    const results = await Promise.allSettled([attempt1, attempt2]);

    const rejections = results.filter((r) => r.status === "rejected");
    expect(rejections.length).toBeGreaterThan(0);
    
    const apiError = (rejections[0] as PromiseRejectedResult).reason as ApiError;
    expect(apiError.code).toBe("LAST_ACTIVE_SUPER_ADMIN");
  }, 15000);

  test("should prevent circular reporting", async () => {
    const passwordHash = await hashPassword("Test@123");
    const commonFields = {
      passwordHash,
      phone: "+1234567890",
      department: "Engineering",
      designation: "Engineer",
      salaryInPaise: 1000000,
      joiningDate: "2026-01-01",
      status: "active" as const,
      role: "employee" as const,
    };

    const emp1 = await repo.createEmployeeTransactionSafe({ ...commonFields, employeeCode: "EMP001", name: "Emp 1", email: "1@test.com" });
    const emp2 = await repo.createEmployeeTransactionSafe({ ...commonFields, employeeCode: "EMP002", name: "Emp 2", email: "2@test.com", managerId: emp1.id });
    const emp3 = await repo.createEmployeeTransactionSafe({ ...commonFields, employeeCode: "EMP003", name: "Emp 3", email: "3@test.com", managerId: emp2.id });

    // Attempt to make emp1 report to emp3 (creates cycle: 1 -> 3 -> 2 -> 1)
    expect(
      repo.updateEmployeeTransactionSafe(emp1.id, { managerId: emp3.id }, { id: emp1.id, role: "super_admin" })
    ).rejects.toThrow("Circular reporting structure detected");
  }, 15000);
});
