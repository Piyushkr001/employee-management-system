import { describe, it, expect, spyOn, beforeEach } from "bun:test";
import request from "supertest";
import app from "../src/app";
import { EmployeeRepository } from "../src/modules/employees/employee.repository";
import jwt from "jsonwebtoken";
import { signAccessToken } from "../src/utils/jwt";
import { env } from "../src/config/env";
import { AuthRepository } from "../src/modules/auth/auth.repository";

describe("Employee API Integration Tests", () => {
  beforeEach(() => {
    spyOn(AuthRepository.prototype, "findEmployeeIdentityById").mockImplementation(async (id) => {
      if (id === "superadmin123") {
        return { id: "superadmin123", email: "admin@empnexa.com", name: "Admin", role: "super_admin", status: "active", deletedAt: null } as any;
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
      if (id === "1") return { id: "1", name: "Employee 1" } as any;
      return undefined;
    });

    spyOn(EmployeeRepository.prototype, "create").mockImplementation(async (data) => {
      return { id: "2", ...data } as any;
    });
  });
  const token = signAccessToken({ sub: "superadmin123", role: "super_admin", employeeCode: "SA001" });
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
      .send({ name: "Incomplete User" }); // missing email, password, etc

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error?.code).toBe("VALIDATION_ERROR");
  });
});
