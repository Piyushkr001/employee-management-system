import { expect, test, describe, beforeEach } from "bun:test";
import request from "supertest";
import app from "../../src/app";
import { cleanTestDatabase } from "./setup";
import { createActiveSuperAdmin, createHrManager, createTestEmployee } from "./fixtures";
import { signAccessToken } from "../../src/utils/jwt";
import { env } from "../../src/config/env";

describe("HTTP to PostgreSQL Integration", () => {
  beforeEach(async () => {
    await cleanTestDatabase();
  });

  const getCookie = (token: string) => `${env.COOKIE_NAME}=${token}`;
  const setHeaders = (req: any, token?: string) => {
    if (token) req.set("Cookie", getCookie(token));
    req.set("X-EmpNexa-Request", "web");
    req.set("Content-Type", "application/json");
    return req;
  };

  test("Transactional creation: POST employee with inactive manager", async () => {
    const hr = await createHrManager();
    const hrToken = signAccessToken({ sub: hr.id, role: hr.role, employeeCode: hr.employeeCode });

    const inactiveManager = await createTestEmployee({ status: "inactive" });

    const response = await setHeaders(request(app).post("/api/employees"), hrToken)
      .send({
        employeeCode: "NEW001",
        name: "New Employee",
        email: "new@empnexa.com",
        password: "password123",
        phone: "+1234567890",
        department: "Engineering",
        designation: "Developer",
        salary: 50000,
        joiningDate: "2024-01-01",
        status: "active",
        role: "employee",
        managerId: inactiveManager.id,
      });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe("INVALID_MANAGER");
  });

  test("Transactional creation: POST employee with soft-deleted manager", async () => {
    const hr = await createHrManager();
    const hrToken = signAccessToken({ sub: hr.id, role: hr.role, employeeCode: hr.employeeCode });

    const deletedManager = await createTestEmployee({ deletedAt: new Date() });

    const response = await setHeaders(request(app).post("/api/employees"), hrToken)
      .send({
        employeeCode: "NEW001_DEL",
        name: "New Employee",
        email: "new_del@empnexa.com",
        password: "password123",
        phone: "+1234567890",
        department: "Engineering",
        designation: "Developer",
        salary: 50000,
        joiningDate: "2024-01-01",
        status: "active",
        role: "employee",
        managerId: deletedManager.id,
      });

    expect(response.status).toBe(422);
    expect(response.body.error.code).toBe("INVALID_MANAGER");

    const { testDb } = require("./test-db");
    const { employees } = require("../../src/db/schema/employees");
    const { eq } = require("drizzle-orm");

    const emailCheck = await testDb.query.employees.findFirst({
      where: eq(employees.email, "new_del@empnexa.com")
    });
    expect(emailCheck).toBeUndefined();

    const codeCheck = await testDb.query.employees.findFirst({
      where: eq(employees.employeeCode, "NEW001_DEL")
    });
    expect(codeCheck).toBeUndefined();
  });

  test("Duplicate email: POST duplicate email", async () => {
    const hr = await createHrManager();
    const hrToken = signAccessToken({ sub: hr.id, role: hr.role, employeeCode: hr.employeeCode });

    const existingEmployee = await createTestEmployee({ email: "exist@empnexa.com" });

    const response = await setHeaders(request(app).post("/api/employees"), hrToken)
      .send({
        employeeCode: "NEW002",
        name: "New Employee",
        email: "exist@empnexa.com",
        password: "password123",
        phone: "+1234567890",
        department: "Engineering",
        designation: "Developer",
        salary: 50000,
        joiningDate: "2024-01-01",
      });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("EMAIL_ALREADY_EXISTS");
  });

  test("Employee field authorization: Employee updates salary", async () => {
    const employee = await createTestEmployee({ salaryInPaise: 5000000 });
    const empToken = signAccessToken({ sub: employee.id, role: employee.role, employeeCode: employee.employeeCode });

    const response = await setHeaders(request(app).put(`/api/employees/${employee.id}`), empToken)
      .send({
        salary: 60000,
      });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("FORBIDDEN_FIELD");
  });

  test("HR and Super Admin: HR updates current Super Admin", async () => {
    const hr = await createHrManager();
    const hrToken = signAccessToken({ sub: hr.id, role: hr.role, employeeCode: hr.employeeCode });

    const admin = await createActiveSuperAdmin();

    const response = await setHeaders(request(app).put(`/api/employees/${admin.id}`), hrToken)
      .send({
        phone: "+9999999999",
      });

    expect(response.status).toBe(403);
    expect(response.body.error.code).toBe("CANNOT_MODIFY_SUPER_ADMIN");
  });

  test("Deleted authentication: Soft-deleted Employee login", async () => {
    const employee = await createTestEmployee({ deletedAt: new Date(), passwordHash: "$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" }); // Password won't matter, auth fails early

    const response = await setHeaders(request(app).post("/api/auth/login"))
      .send({
        email: employee.email,
        password: "password123"
      });

    expect(response.status).toBe(401);
  });

  test("Deleted update: PUT deleted Employee", async () => {
    const hr = await createHrManager();
    const hrToken = signAccessToken({ sub: hr.id, role: hr.role, employeeCode: hr.employeeCode });

    const deletedEmployee = await createTestEmployee({ deletedAt: new Date() });

    const response = await setHeaders(request(app).put(`/api/employees/${deletedEmployee.id}`), hrToken)
      .send({
        phone: "+8888888888"
      });

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("EMPLOYEE_NOT_FOUND");
  });

  test("Super Admin: Self-deletion returns 403", async () => {
    const admin = await createActiveSuperAdmin();
    const adminToken = signAccessToken({ sub: admin.id, role: admin.role, employeeCode: admin.employeeCode });

    const response = await setHeaders(request(app).delete(`/api/employees/${admin.id}`), adminToken)
      .send({});

    expect(response.status).toBe(403);
    // Based on standard error definitions, self-delete returns 403 FORBIDDEN
    expect(response.body.error.code).toBe("FORBIDDEN");
  });

  test("Final administrator: Deactivate final active Super Admin", async () => {
    const admin = await createActiveSuperAdmin();
    const adminToken = signAccessToken({ sub: admin.id, role: admin.role, employeeCode: admin.employeeCode });

    const response = await setHeaders(request(app).put(`/api/employees/${admin.id}`), adminToken)
      .send({
        status: "inactive"
      });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("LAST_ACTIVE_SUPER_ADMIN");
  });

  test("Final administrator: Demote final active Super Admin", async () => {
    const admin = await createActiveSuperAdmin();
    const adminToken = signAccessToken({ sub: admin.id, role: admin.role, employeeCode: admin.employeeCode });

    const response = await setHeaders(request(app).put(`/api/employees/${admin.id}`), adminToken)
      .send({
        role: "employee"
      });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("LAST_ACTIVE_SUPER_ADMIN");
  });

  test("Manager deactivation: Deactivate manager with active reportees", async () => {
    const admin = await createActiveSuperAdmin();
    const adminToken = signAccessToken({ sub: admin.id, role: admin.role, employeeCode: admin.employeeCode });

    const manager = await createTestEmployee();
    await createTestEmployee({ managerId: manager.id });

    const response = await setHeaders(request(app).put(`/api/employees/${manager.id}`), adminToken)
      .send({
        status: "inactive"
      });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("MANAGER_HAS_ACTIVE_REPORTEES");
  });

  test("Concurrent Super Admin changes: Deactivation", async () => {
    const admin1 = await createActiveSuperAdmin();
    const admin2 = await createActiveSuperAdmin();
    const token1 = signAccessToken({ sub: admin1.id, role: admin1.role, employeeCode: admin1.employeeCode });
    const token2 = signAccessToken({ sub: admin2.id, role: admin2.role, employeeCode: admin2.employeeCode });

    // admin1 tries to deactivate admin2, while admin2 tries to deactivate admin1
    const attempt1 = setHeaders(request(app).put(`/api/employees/${admin2.id}`), token1).send({ status: "inactive" });
    const attempt2 = setHeaders(request(app).put(`/api/employees/${admin1.id}`), token2).send({ status: "inactive" });

    const results = await Promise.allSettled([attempt1, attempt2]);
    const responses = results.map(r => (r as any).value);

    const succeeded = responses.filter(r => r.status === 200);
    const failed = responses.filter(r => r.status === 403 || r.status === 409);

    expect(succeeded.length).toBe(1);
    expect(failed.length).toBe(1);
    expect(["LAST_ACTIVE_SUPER_ADMIN", "FORBIDDEN"]).toContain(failed[0].body.error.code);

    const { testDb } = require("./test-db");
    const { employees } = require("../../src/db/schema/employees");
    const { and, eq, isNull } = require("drizzle-orm");

    const activeAdmins = await testDb.select({ id: employees.id }).from(employees)
      .where(and(eq(employees.role, "super_admin"), eq(employees.status, "active"), isNull(employees.deletedAt)));
    expect(activeAdmins).toHaveLength(1);
  });

  test("Concurrent Super Admin changes: Demotion", async () => {
    const admin1 = await createActiveSuperAdmin();
    const admin2 = await createActiveSuperAdmin();
    const token1 = signAccessToken({ sub: admin1.id, role: admin1.role, employeeCode: admin1.employeeCode });
    const token2 = signAccessToken({ sub: admin2.id, role: admin2.role, employeeCode: admin2.employeeCode });

    // admin1 tries to demote admin2, while admin2 tries to demote admin1
    const attempt1 = setHeaders(request(app).put(`/api/employees/${admin2.id}`), token1).send({ role: "employee" });
    const attempt2 = setHeaders(request(app).put(`/api/employees/${admin1.id}`), token2).send({ role: "employee" });

    const results = await Promise.allSettled([attempt1, attempt2]);
    const responses = results.map(r => (r as any).value);

    const succeeded = responses.filter(r => r.status === 200);
    const failed = responses.filter(r => r.status === 403 || r.status === 409);

    expect(succeeded.length).toBe(1);
    expect(failed.length).toBe(1);
    expect(["LAST_ACTIVE_SUPER_ADMIN", "FORBIDDEN"]).toContain(failed[0].body.error.code);

    const { testDb } = require("./test-db");
    const { employees } = require("../../src/db/schema/employees");
    const { and, eq, isNull } = require("drizzle-orm");

    const activeAdmins = await testDb.select({ id: employees.id }).from(employees)
      .where(and(eq(employees.role, "super_admin"), eq(employees.status, "active"), isNull(employees.deletedAt)));
    expect(activeAdmins).toHaveLength(1);
  });

  test("Concurrent Super Admin changes: Soft deletion", async () => {
    // Need a 3rd admin to act as actor because super admins can't delete themselves
    const actorAdmin = await createActiveSuperAdmin();
    const admin1 = await createActiveSuperAdmin();
    const admin2 = await createActiveSuperAdmin();
    const adminToken = signAccessToken({ sub: actorAdmin.id, role: actorAdmin.role, employeeCode: actorAdmin.employeeCode });

    const attempt1 = setHeaders(request(app).delete(`/api/employees/${admin1.id}`), adminToken);
    const attempt2 = setHeaders(request(app).delete(`/api/employees/${admin2.id}`), adminToken);
    // Since actorAdmin is also active super admin, deleting admin1 and admin2 concurrently shouldn't conflict with LAST_ACTIVE_SUPER_ADMIN, 
    // Wait, if there are 3 active super admins, deleting two is fine!
    // But we want to test exactly one active super admin remains.
    // So actorAdmin should delete admin1 and actorAdmin should be deactivated concurrently?
    // Or we just deactivate the actorAdmin first so we only have admin1 and admin2 left!
    const { testDb } = require("./test-db");
    const { employees } = require("../../src/db/schema/employees");
    const { eq } = require("drizzle-orm");
    await testDb.update(employees).set({ status: "inactive" }).where(eq(employees.id, actorAdmin.id));

    // Wait! A deactivated super admin cannot delete employees (actor must be active)
    // So we need another super admin (admin3) who performs the deletion!
    const admin3 = await createActiveSuperAdmin();
    const admin3Token = signAccessToken({ sub: admin3.id, role: admin3.role, employeeCode: admin3.employeeCode });
    // If admin3 performs deletions, then admin3 is also an active super admin, so there are 3.
    // If admin3 tries to delete admin1 and admin2, it succeeds! Because admin3 will remain.
    // Let's just have admin3 attempt to delete admin1, and CONCURRENTLY admin1 attempts to delete admin3!
    const admin1Token = signAccessToken({ sub: admin1.id, role: admin1.role, employeeCode: admin1.employeeCode });

    // Both attempt to delete each other.
    const attempt11 = setHeaders(request(app).delete(`/api/employees/${admin1.id}`), admin3Token);
    const attempt22 = setHeaders(request(app).delete(`/api/employees/${admin3.id}`), admin1Token);

    const results = await Promise.allSettled([attempt11, attempt22]);
    const responses = results.map(r => (r as any).value);

    // One succeeds, the other fails with LAST_ACTIVE_SUPER_ADMIN because there were only 2 left (if we ignore the inactive ones)
    // Actually there are others created before in tests, but we clean the DB before each test!
    // So admin3 and admin1 are the ONLY active super admins created in this block (plus actorAdmin which was deactivated, plus admin2 which was created but not used here, let's just deactivate admin2 as well to be sure there are only exactly 2).
    await testDb.update(employees).set({ status: "inactive" }).where(eq(employees.id, admin2.id));

    const succeeded = responses.filter(r => r.status === 200);
    const failed = responses.filter(r => r.status === 409 || r.status === 403 || r.status === 404);

    expect(succeeded.length).toBe(1);
    expect(failed.length).toBe(1);
  });
});
