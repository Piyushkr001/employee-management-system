import { describe, it, expect, spyOn, beforeEach, afterEach, mock } from "bun:test";
import request from "supertest";
import app from "../../src/app";
import { EmployeeRepository } from "../../src/modules/employees/employee.repository";
import jwt from "jsonwebtoken";
import { signAccessToken } from "../../src/utils/jwt";
import { env } from "../../src/config/env";
import { AuthRepository } from "../../src/modules/auth/auth.repository";

const SUPER_ADMIN_ID = "11111111-1111-4111-8111-111111111111";
const EMPLOYEE_ID = "33333333-3333-4333-8333-333333333333";

describe("Employee API Integration Tests", () => {
  beforeEach(() => {
    spyOn(AuthRepository.prototype, "findFullEmployeeById").mockImplementation(async (id) => {
      if (id === SUPER_ADMIN_ID) {
        return { 
          id: SUPER_ADMIN_ID, 
          email: "admin@empnexa.com", 
          name: "Admin", 
          role: "super_admin", 
          status: "active", 
          deletedAt: null,
          employeeCode: "SA001",
          phone: null,
          department: "Administration",
          designation: "Super Admin",
          joiningDate: "2026-01-01",
          managerId: null,
          profileImageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        } as any;
      }
      if (id === EMPLOYEE_ID) {
        return { 
          id: EMPLOYEE_ID, 
          email: "emp@empnexa.com", 
          name: "Emp", 
          role: "employee", 
          status: "active", 
          deletedAt: null,
          employeeCode: "EMP001",
          phone: null,
          department: "Operations",
          designation: "Employee",
          joiningDate: "2026-01-01",
          managerId: null,
          profileImageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date()
        } as any;
      }
      return null;
    });
    spyOn(EmployeeRepository.prototype, "getPaginated").mockImplementation(async () => {
      return {
        employees: [
          { id: "1", name: "Employee 1", email: "emp1@empnexa.com", role: "employee" }
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false }
      } as any;
    });

    spyOn(EmployeeRepository.prototype, "findById").mockImplementation(async (id) => {
      if (id === EMPLOYEE_ID) return { id: EMPLOYEE_ID, name: "Employee 1", role: "employee" } as any;
      return undefined;
    });

    spyOn(EmployeeRepository.prototype, "createEmployeeTransactionSafe").mockImplementation(async (data) => {
      return { id: "2", ...data } as any;
    });
  });

  afterEach(() => {
    mock.restore();
  });

  const token = signAccessToken({ sub: SUPER_ADMIN_ID, role: "super_admin", employeeCode: "SA001" });
  const cookie = `${env.COOKIE_NAME}=${token}`;

  it("should block unauthenticated access to GET /api/employees", async () => {
    const res = await request(app).get("/api/employees");
    expect(res.status).toBe(401);
  });

  it("should allow authenticated access to GET /api/employees", async () => {
    const res = await request(app)
      .get("/api/employees")
      .set("Cookie", cookie);
      
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.employees).toBeArray();
  });

  it("should fail validation on POST /api/employees with missing fields", async () => {
    const res = await request(app)
      .post("/api/employees")
      .set("Cookie", cookie)
      .set("X-EmpNexa-Request", "web")
      .send({ name: "Incomplete User" }); // missing email, password, etc

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error?.code).toBe("VALIDATION_ERROR");
  });

  it("should retrieve manager options via GET /api/employees/manager-options", async () => {
    spyOn(EmployeeRepository.prototype, "getManagerOptions").mockImplementation(async () => {
      return [{ id: "1", name: "Manager 1" }] as any;
    });
    
    const res = await request(app)
      .get("/api/employees/manager-options")
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.managers).toBeArray();
    expect(res.body.data.managers[0].name).toBe("Manager 1");
  });

  it("should get employee by id via GET /api/employees/:id", async () => {
    const res = await request(app)
      .get(`/api/employees/${EMPLOYEE_ID}`)
      .set("Cookie", cookie);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(EMPLOYEE_ID);
  });

  it("should create employee successfully via POST /api/employees", async () => {
    const res = await request(app)
      .post("/api/employees")
      .set("Cookie", cookie)
      .set("X-EmpNexa-Request", "web")
      .send({
        name: "New Emp",
        email: "new@empnexa.com",
        employeeCode: "EMP100",
        password: "password123",
        phone: "1234567890",
        department: "IT",
        designation: "Developer",
        salary: 50000,
        joiningDate: "2023-01-01"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe("2");
  });

  it("should fail updating employee code or salary if unauthorized (non HR)", async () => {
    spyOn(EmployeeRepository.prototype, "updateEmployeeTransactionSafe").mockImplementation(async (id, data) => {
      return { id, ...data } as any;
    });

    const empToken = signAccessToken({ sub: EMPLOYEE_ID, role: "employee", employeeCode: "E001" });
    const empCookie = `${env.COOKIE_NAME}=${empToken}`;

    const res = await request(app)
      .put(`/api/employees/${EMPLOYEE_ID}`)
      .set("Cookie", empCookie)
      .set("X-EmpNexa-Request", "web")
      .send({ name: "Changed Name", salary: 99999 });
      
    // Should be 403 since employees can't update sensitive fields
    expect(res.status).toBe(403);
  });

  it("should successfully update via PUT /api/employees/:id", async () => {
    spyOn(EmployeeRepository.prototype, "updateEmployeeTransactionSafe").mockImplementation(async (id, data) => {
      return { id, ...data } as any;
    });

    const res = await request(app)
      .put(`/api/employees/${EMPLOYEE_ID}`)
      .set("Cookie", cookie)
      .set("X-EmpNexa-Request", "web")
      .send({ name: "Updated Name" });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Name");
  });

  it("should delete employee successfully via DELETE /api/employees/:id", async () => {
    spyOn(EmployeeRepository.prototype, "softDelete").mockImplementation(async () => {
      return { id: EMPLOYEE_ID } as any;
    });

    const res = await request(app)
      .delete(`/api/employees/${EMPLOYEE_ID}`)
      .set("Cookie", cookie)
      .set("Content-Type", "application/json")
      .set("X-EmpNexa-Request", "web");

    expect(res.status).toBe(200);
  });
});
