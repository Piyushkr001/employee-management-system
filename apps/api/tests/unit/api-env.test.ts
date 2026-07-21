import { expect, test, describe, beforeEach, afterEach } from "bun:test";
import { authorize } from "../../src/middleware/authorize";
import { notFound } from "../../src/middleware/not-found";
import type { Request, Response, NextFunction } from "express";

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
