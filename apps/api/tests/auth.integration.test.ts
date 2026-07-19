import { describe, it, expect, spyOn, beforeEach } from "bun:test";
import request from "supertest";
import app from "../src/app";
import { AuthRepository } from "../src/modules/auth/auth.repository";
import { hashPassword } from "../src/utils/password";

describe("Auth API Integration Tests", () => {
  beforeEach(async () => {
    const hashedPassword = await hashPassword("password123");
    spyOn(AuthRepository.prototype, "findEmployeeForLoginByEmail").mockImplementation(async (email) => {
      if (email === "test@empnexa.com") {
        return {
          id: "123",
          email,
          passwordHash: hashedPassword,
          role: "employee",
          name: "Test User",
          employeeCode: "EMP001",
          phone: "1234567890",
          department: "Engineering",
          designation: "Developer",
          joiningDate: "2024-01-01",
          status: "active",
          managerId: null,
          profileImageUrl: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null
        } as any;
      }
      return undefined as any;
    });

    spyOn(AuthRepository.prototype, "findEmployeeIdentityById").mockImplementation(async (id) => {
      if (id === "123") {
        return { id: "123", email: "test@empnexa.com", name: "Test User", role: "employee" } as any;
      }
      return undefined as any;
    });
  });
  it("should fail login with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("X-EmpNexa-Request", "web")
      .send({ email: "wrong@empnexa.com", password: "wrongpassword" });

    expect(res.status).toBe(401); // Unauthorized for invalid credentials
    // Wait, the error handled will be 500 if not ApiError. Let's just check it fails.
    expect(res.body.success).toBe(false);
  });

  it("should fail with validation errors if inputs are missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("X-EmpNexa-Request", "web")
      .send({ email: "not-an-email" });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error?.code).toBe("VALIDATION_ERROR");
    expect(res.body.error?.fieldErrors?.email).toBeDefined();
    expect(res.body.error?.fieldErrors?.password).toBeDefined();
  });

  it("should successfully login with valid credentials and set cookie", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .set("X-EmpNexa-Request", "web")
      .send({ email: "test@empnexa.com", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe("test@empnexa.com");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should block unauthenticated requests to /api/auth/me", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.status).toBe(401);
  });
});
