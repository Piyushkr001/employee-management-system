import { expect, test, describe, beforeEach } from "bun:test";
import { cleanTestDatabase } from "./setup";
import { createActiveSuperAdmin, createHrManager, createStandardEmployee, createTestEmployee } from "./fixtures";
import { EmployeeRepository } from "../../src/modules/employees/employee.repository";
import { testDb } from "./test-db";
import { employees } from "../../src/db/schema/employees";
import { eq } from "drizzle-orm";

describe("Locked-Actor Update Authorization", () => {
  const repo = new EmployeeRepository();

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  test("Demoted actor: Request actor says HR Manager, DB actor role is Employee -> update rejected with FORBIDDEN", async () => {
    const actorRow = await createStandardEmployee(); // Real role in DB is employee
    const target = await createStandardEmployee();
    
    const staleActor = { id: actorRow.id, role: "hr_manager" as const }; // Stale request claims hr_manager

    await expect(repo.updateEmployeeTransactionSafe(target.id, { phone: "9999999999" }, staleActor))
      .rejects.toThrow("Cannot modify another employee");

    const unchangedTarget = await testDb.query.employees.findFirst({ where: eq(employees.id, target.id) });
    expect(unchangedTarget?.phone).not.toBe("9999999999");
  });

  test("Inactive actor: Request actor says Super Admin, DB actor status is inactive -> update rejected with FORBIDDEN", async () => {
    const actorRow = await createTestEmployee({ role: "super_admin", status: "inactive" });
    const target = await createStandardEmployee();

    const staleActor = { id: actorRow.id, role: "super_admin" as const };

    await expect(repo.updateEmployeeTransactionSafe(target.id, { phone: "9999999999" }, staleActor))
      .rejects.toThrow("Your account is not authorized");

    const unchangedTarget = await testDb.query.employees.findFirst({ where: eq(employees.id, target.id) });
    expect(unchangedTarget?.phone).not.toBe("9999999999");
  });

  test("Deleted actor: Request actor says Super Admin, DB actor deletedAt is non-null -> update rejected with FORBIDDEN", async () => {
    const actorRow = await createTestEmployee({ role: "super_admin", deletedAt: new Date() });
    const target = await createStandardEmployee();

    const staleActor = { id: actorRow.id, role: "super_admin" as const };

    await expect(repo.updateEmployeeTransactionSafe(target.id, { phone: "9999999999" }, staleActor))
      .rejects.toThrow("Your account is not authorized");

    const unchangedTarget = await testDb.query.employees.findFirst({ where: eq(employees.id, target.id) });
    expect(unchangedTarget?.phone).not.toBe("9999999999");
  });

  test("Super Admin demotion: Request actor says Super Admin, DB actor role is HR Manager -> Super-Admin-only update rejected", async () => {
    const actorRow = await createHrManager(); // Actual role HR Manager
    const target = await createActiveSuperAdmin(); // Target is super admin (HR manager can't edit super admin)

    const staleActor = { id: actorRow.id, role: "super_admin" as const };

    await expect(repo.updateEmployeeTransactionSafe(target.id, { phone: "9999999999" }, staleActor))
      .rejects.toThrow("Cannot modify Super Admin");

    const unchangedTarget = await testDb.query.employees.findFirst({ where: eq(employees.id, target.id) });
    expect(unchangedTarget?.phone).not.toBe("9999999999");
  });

  test("Test A — stale Super Admin actor updating self", async () => {
    const actorRow = await createStandardEmployee();
    const staleActor = { id: actorRow.id, role: "super_admin" as const };
    
    const result = await repo.updateEmployeeTransactionSafe(actorRow.id, { phone: "9876543210" }, staleActor);
    
    expect(result.employee.phone).toBe("9876543210");
    expect(result.effectiveActorRole).toBe("employee");
  });

  test("Test B — stale HR Manager actor updating self", async () => {
    const actorRow = await createStandardEmployee();
    const staleActor = { id: actorRow.id, role: "hr_manager" as const };
    
    const result = await repo.updateEmployeeTransactionSafe(actorRow.id, { profileImageUrl: "http://example.com/img.png" }, staleActor);
    
    expect(result.employee.profileImageUrl).toBe("http://example.com/img.png");
    expect(result.effectiveActorRole).toBe("employee");
  });

  test("Test C — self-demotion Super Admin", async () => {
    const actorRow = await createActiveSuperAdmin();
    await createActiveSuperAdmin(); // Another active super admin exists
    const actor = { id: actorRow.id, role: "super_admin" as const };
    
    const result = await repo.updateEmployeeTransactionSafe(actorRow.id, { role: "employee" }, actor);
    
    expect(result.employee.role).toBe("employee");
    expect(result.effectiveActorRole).toBe("employee");
  });

  test("Test D — HR self-demotion", async () => {
    const actorRow = await createHrManager();
    const actor = { id: actorRow.id, role: "hr_manager" as const };
    
    const result = await repo.updateEmployeeTransactionSafe(actorRow.id, { role: "employee" }, actor);
    
    expect(result.employee.role).toBe("employee");
    expect(result.effectiveActorRole).toBe("employee");
  });

  test("Test E — stale privileged actor updates another Employee", async () => {
    const actorRow = await createStandardEmployee();
    const target = await createStandardEmployee();
    
    const staleActor = { id: actorRow.id, role: "super_admin" as const };
    
    await expect(
      repo.updateEmployeeTransactionSafe(target.id, { phone: "9876543210" }, staleActor)
    ).rejects.toThrow("Cannot modify another employee");
  });
});
