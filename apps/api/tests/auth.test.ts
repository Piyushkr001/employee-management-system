import { describe, expect, it } from "bun:test";
import { signAccessToken, verifyAccessToken } from "../src/utils/jwt";
import { hashPassword, comparePassword } from "../src/utils/password";
import { env } from "../src/config/env";

describe("Auth Utilities", () => {
  describe("Password Hashing", () => {
    it("should hash and compare correctly", async () => {
      const password = "SuperSecretPassword123!";
      const hash = await hashPassword(password);
      
      expect(hash).not.toBe(password);
      expect(await comparePassword(password, hash)).toBe(true);
      expect(await comparePassword("wrong_password", hash)).toBe(false);
    });
  });

  describe("JWT Signing", () => {
    it("should sign and verify tokens correctly", () => {
      const payload = {
        sub: "user-123",
        role: "super_admin" as const,
        employeeCode: "EMP001"
      };

      const token = signAccessToken(payload);
      expect(token).toBeString();

      const decoded = verifyAccessToken(token);
      expect(decoded.sub).toBe(payload.sub);
      expect(decoded.role).toBe(payload.role);
      expect(decoded.employeeCode).toBe(payload.employeeCode);
    });
  });
});
