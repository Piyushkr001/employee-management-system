import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { getInternalApiUrl } from "../lib/api-utils";

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
      Object.defineProperty(process.env, "NODE_ENV", { value: "production", writable: true });
      delete process.env.API_PROXY_TARGET;
      
      const { default: nextConfig } = await import("../next.config");
      
      if (typeof nextConfig.rewrites === "function") {
        await expect(nextConfig.rewrites()).rejects.toThrow("API_PROXY_TARGET is required in production");
      }
    });
  });

  describe("API_INTERNAL_URL", () => {
    test("should throw in production if API_INTERNAL_URL is missing", () => {
      Object.defineProperty(process.env, "NODE_ENV", { value: "production", writable: true });
      delete process.env.API_INTERNAL_URL;
      
      expect(() => getInternalApiUrl()).toThrow("API_INTERNAL_URL is required in production");
    });

    test("should return fallback in development if missing", () => {
      Object.defineProperty(process.env, "NODE_ENV", { value: "development", writable: true });
      delete process.env.API_INTERNAL_URL;
      // We will change the fallback to port 5001 later, but for now test what the function does
      expect(getInternalApiUrl()).toBe("http://localhost:5001/api");
    });
  });
});
