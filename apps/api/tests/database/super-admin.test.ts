import { expect, test, describe, beforeAll, afterAll, beforeEach } from "bun:test";
import { setupTestDatabase, cleanTestDatabase, closeTestDatabase } from "./setup";
import { createActiveSuperAdmin, createInactiveSuperAdmin, createTestEmployee } from "./fixtures";
import { EmployeeRepository } from "../../src/modules/employees/employee.repository";

describe("Super Admin Protection", () => {
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

  test("should prevent soft-deleting the last active super admin", async () => {
    const admin = await createActiveSuperAdmin();
    await expect(
      repo.softDelete(admin.id)
    ).rejects.toThrow("Cannot remove the last active Super Admin");
  });

  test("should allow demoting an inactive super admin even if they are the only one", async () => {
    // If the system somehow gets into a state with only an inactive super admin (e.g. manually in DB),
    // they don't count as the "last active", so demoting them is allowed.
    // However, our code explicitly checks `removesActiveSuperAdmin`.
    const admin = await createInactiveSuperAdmin();
    const actor = { id: admin.id, role: admin.role };

    const updated = await repo.updateEmployeeTransactionSafe(admin.id, { role: "employee" }, actor);
    expect(updated.role).toBe("employee");
  });

  test("should concurrently protect the last active super admin", async () => {
    const admin1 = await createActiveSuperAdmin();
    const admin2 = await createActiveSuperAdmin();
    const actor = { id: admin1.id, role: admin1.role };

    // Both attempt to deactivate the OTHER super admin
    const attempt1 = repo.updateEmployeeTransactionSafe(admin2.id, { status: "inactive" }, actor);
    const attempt2 = repo.updateEmployeeTransactionSafe(admin1.id, { status: "inactive" }, actor);

    const results = await Promise.allSettled([attempt1, attempt2]);
    
    const succeeded = results.filter(r => r.status === "fulfilled");
    const failed = results.filter(r => r.status === "rejected");
    
    // One succeeds, one fails because it becomes the "last" active super admin
    expect(succeeded.length).toBe(1);
    expect(failed.length).toBe(1);
    
    if (failed[0] && failed[0].status === "rejected") {
      expect(failed[0].reason.code).toBe("LAST_ACTIVE_SUPER_ADMIN");
    }
  }, 10000);
});
