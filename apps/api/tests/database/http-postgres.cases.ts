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
    expect(failed[0].body.error.code).not.toBe("40P01");

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

    expect(["LAST_ACTIVE_SUPER_ADMIN", "FORBIDDEN"]).toContain(failed[0].body.error.code);
    expect(failed[0].body.error.code).not.toBe("40P01");

    const { testDb } = require("./test-db");
    const { employees } = require("../../src/db/schema/employees");
    const { and, eq, isNull } = require("drizzle-orm");

    const activeAdmins = await testDb.select({ id: employees.id }).from(employees)
      .where(and(eq(employees.role, "super_admin"), eq(employees.status, "active"), isNull(employees.deletedAt)));
    expect(activeAdmins).toHaveLength(1);
  });

  test("Concurrent Super Admin changes: Soft deletion", async () => {
    // Exactly two active Super Admins cross-deleting each other
    const adminA = await createActiveSuperAdmin();
    const adminB = await createActiveSuperAdmin();
    
    const tokenA = signAccessToken({ sub: adminA.id, role: adminA.role, employeeCode: adminA.employeeCode });
    const tokenB = signAccessToken({ sub: adminB.id, role: adminB.role, employeeCode: adminB.employeeCode });

    // Both attempt to delete each other concurrently
    const attemptA = setHeaders(request(app).delete(`/api/employees/${adminB.id}`), tokenA);
    const attemptB = setHeaders(request(app).delete(`/api/employees/${adminA.id}`), tokenB);

    const results = await Promise.allSettled([attemptA, attemptB]);
    const responses = results.map(r => (r as any).value);

    const succeeded = responses.filter(r => r.status === 200);
    const failed = responses.filter(r => r.status === 409 || r.status === 403 || r.status === 404);

    expect(succeeded.length).toBe(1);
    expect(failed.length).toBe(1);
    expect(["LAST_ACTIVE_SUPER_ADMIN", "FORBIDDEN", "EMPLOYEE_NOT_FOUND"]).toContain(failed[0].body.error.code);
    expect(failed[0].body.error.code).not.toBe("40P01"); // No deadlock

    const { testDb } = require("./test-db");
    const { employees } = require("../../src/db/schema/employees");
    const { and, eq, isNull } = require("drizzle-orm");

    const activeAdmins = await testDb.select({ id: employees.id }).from(employees)
      .where(and(eq(employees.role, "super_admin"), eq(employees.status, "active"), isNull(employees.deletedAt)));
    
    // Exactly one active, non-deleted Super Admin remains
    expect(activeAdmins).toHaveLength(1);
  });
});
