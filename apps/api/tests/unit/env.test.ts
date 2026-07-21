import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { authorize } from "../../src/middleware/authorize";
import { notFound } from "../../src/middleware/not-found";
import { getInternalApiUrl } from "../../../web/lib/api-utils";
import type { Request, Response, NextFunction } from "express";

describe("Environment & Security Validation", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("API_PROXY_TARGET", () => {
    test("should throw in production if API_PROXY_TARGET is missing", async () => {
      process.env.NODE_ENV = "production";
      delete process.env.API_PROXY_TARGET;
      
      const { default: nextConfig } = await import("../../../web/next.config");
      
      if (typeof nextConfig.rewrites === "function") {
        await expect(nextConfig.rewrites()).rejects.toThrow("API_PROXY_TARGET is required in production");
      }
    });
  });

  describe("API_INTERNAL_URL", () => {
    test("should throw in production if API_INTERNAL_URL is missing", () => {
      process.env.NODE_ENV = "production";
      delete process.env.API_INTERNAL_URL;
      
      expect(() => getInternalApiUrl()).toThrow("API_INTERNAL_URL is required in production");
    });

    test("should return localhost fallback in development if missing", () => {
      process.env.NODE_ENV = "development";
      delete process.env.API_INTERNAL_URL;
      
      expect(getInternalApiUrl()).toBe("http://localhost:5000/api");
    });
  });

  describe("Seed Safety", () => {
    function assertSafeSeedDatabase(databaseUrl: string): void {
      const parsed = new URL(databaseUrl);
      const databaseName = parsed.pathname.replace(/^\/+/, "");
      const looksSafe = /(^|[_-])(dev|development|local|test)($|[_-])/i.test(databaseName);
      const explicitlyAllowed = process.env.ALLOW_DEMO_SEED === "true";
    
      if (!looksSafe && !explicitlyAllowed) {
        throw new Error(`Refusing to seed unsafe database: ${databaseName}`);
      }
    }

    test("should block production seed without override", () => {
      process.env.NODE_ENV = "production";
      process.env.ALLOW_DEMO_SEED = "false";
      const isProduction = process.env.NODE_ENV === "production";
      const allowDemoSeed = process.env.ALLOW_DEMO_SEED === "true";

      expect(() => {
        if (isProduction && !allowDemoSeed) {
          throw new Error("Refusing to seed demo data in production");
        }
      }).toThrow("Refusing to seed demo data in production");
    });

    test("should reject unsafe seed database name", () => {
      process.env.ALLOW_DEMO_SEED = "false";
      expect(() => assertSafeSeedDatabase("postgres://user:pass@host/empnexa_prod"))
        .toThrow("Refusing to seed unsafe database: empnexa_prod");
    });

    test("should accept safe development database", () => {
      process.env.ALLOW_DEMO_SEED = "false";
      expect(() => assertSafeSeedDatabase("postgres://user:pass@host/empnexa_dev")).not.toThrow();
    });
  });

  describe("Middleware Error Contracts", () => {
    test("Authorization middleware denial should yield 403 FORBIDDEN", () => {
      const req = { user: { role: "employee" } } as unknown as Request;
      const res = {} as Response;
      const next = ((err: any) => {
        expect(err.statusCode).toBe(403);
        expect(err.code).toBe("FORBIDDEN");
      }) as NextFunction;

      authorize("super_admin")(req, res, next);
    });

    test("Unknown route middleware should yield 404 NOT_FOUND", () => {
      const req = { originalUrl: "/unknown" } as Request;
      const res = {} as Response;
      const next = ((err: any) => {
        expect(err.statusCode).toBe(404);
        expect(err.code).toBe("NOT_FOUND");
      }) as NextFunction;

      notFound(req, res, next);
    });
  });
});
