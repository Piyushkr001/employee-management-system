import { expect, test, describe, beforeAll, afterAll, beforeEach } from "bun:test";
import { setupTestDatabase, cleanTestDatabase, closeTestDatabase } from "./setup";
import { createActiveSuperAdmin, createInactiveSuperAdmin, createTestEmployee } from "./fixtures";
import { EmployeeRepository } from "../../src/modules/employees/employee.repository";

describe("Super Admin Protection", () => {
  const repo = new EmployeeRepository();

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  test("should prevent demoting the last active super admin", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };

    await expect(
      repo.updateEmployeeTransactionSafe(admin.id, { role: "employee" }, actor)
    ).rejects.toThrow("Cannot demote or deactivate the last active Super Admin");
  });

  test("should prevent deactivating the last active super admin", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };

    await expect(
      repo.updateEmployeeTransactionSafe(admin.id, { status: "inactive" }, actor)
    ).rejects.toThrow("Cannot demote or deactivate the last active Super Admin");
  });

  test("should prevent Super Admin self-deletion", async () => {
    const admin = await createActiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };
    await expect(
      repo.softDelete(admin.id, actor)
    ).rejects.toThrow("You cannot delete your own account");
  });

  test("should allow demoting an inactive super admin even if they are the only one", async () => {
    const admin = await createInactiveSuperAdmin();
    const activeAdmin = await createActiveSuperAdmin();
    const actor = { id: activeAdmin.id, role: activeAdmin.role };

    const updated = await repo.updateEmployeeTransactionSafe(admin.id, { role: "employee" }, actor);
    expect(updated.role).toBe("employee");
  });

  test("should concurrently protect the last active super admin from cross-account demotion", async () => {
    const admin1 = await createActiveSuperAdmin();
    const admin2 = await createActiveSuperAdmin();

    const actor1 = { id: admin1.id, role: admin1.role };
    const actor2 = { id: admin2.id, role: admin2.role };

    const attempt1 = repo.updateEmployeeTransactionSafe(admin2.id, { role: "employee" }, actor1);
    const attempt2 = repo.updateEmployeeTransactionSafe(admin1.id, { role: "employee" }, actor2);

    const results = await Promise.allSettled([attempt1, attempt2]);
    
    const succeeded = results.filter(r => r.status === "fulfilled");
    const failed = results.filter(r => r.status === "rejected");
    
    expect(succeeded).toHaveLength(1);
    expect(failed).toHaveLength(1);
    
    if (failed[0] && failed[0].status === "rejected") {
      const errCode = failed[0].reason?.code || failed[0].reason?.message;
      expect(["LAST_ACTIVE_SUPER_ADMIN", "FORBIDDEN"]).toContain(errCode);
      expect(failed[0].reason.statusCode).not.toBe(500);
      expect(errCode).not.toBe("40P01");
    }

    const { testDb } = require("./test-db");
    const { employees } = require("../../src/db/schema/employees");
    const { and, eq, isNull } = require("drizzle-orm");

    const activeAdmins = await testDb.select({ id: employees.id }).from(employees)
      .where(and(eq(employees.role, "super_admin"), eq(employees.status, "active"), isNull(employees.deletedAt)));
    
    expect(activeAdmins).toHaveLength(1);
  }, 10000);

  test("should concurrently protect the last active super admin from cross-account deletion", async () => {
    const admin1 = await createActiveSuperAdmin();
    const admin2 = await createActiveSuperAdmin();

    const actor1 = { id: admin1.id, role: admin1.role };
    const actor2 = { id: admin2.id, role: admin2.role };

    const attempt1 = repo.softDelete(admin2.id, actor1);
    const attempt2 = repo.softDelete(admin1.id, actor2);

    const results = await Promise.allSettled([attempt1, attempt2]);
    
    const succeeded = results.filter(r => r.status === "fulfilled");
    const failed = results.filter(r => r.status === "rejected");
    
    expect(succeeded).toHaveLength(1);
    expect(failed).toHaveLength(1);
    
    if (failed[0] && failed[0].status === "rejected") {
      const errCode = failed[0].reason?.code || failed[0].reason?.message;
      expect(["LAST_ACTIVE_SUPER_ADMIN", "FORBIDDEN"]).toContain(errCode);
      expect(failed[0].reason.statusCode).not.toBe(500);
      expect(errCode).not.toBe("40P01");
    }

    const { testDb } = require("./test-db");
    const { employees } = require("../../src/db/schema/employees");
    const { and, eq, isNull } = require("drizzle-orm");

    const activeAdmins = await testDb.select({ id: employees.id }).from(employees)
      .where(and(eq(employees.role, "super_admin"), eq(employees.status, "active"), isNull(employees.deletedAt)));
    
    expect(activeAdmins).toHaveLength(1);
  }, 10000);
});
