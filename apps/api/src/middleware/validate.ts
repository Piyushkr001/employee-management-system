import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";


type RequestLocation = "body" | "query" | "params";

export function validate<T>(
  schema: ZodType<T>,
  location: RequestLocation = "body",
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await schema.safeParseAsync(req[location]);

      if (!result.success) {
        return res.status(422).json({
          success: false,
          message: "Validation failed",
          error: {
            code: "VALIDATION_ERROR",
            fieldErrors: result.error.flatten().fieldErrors,
          },
        });
      }

      req[location] = result.data as never;
      next();
    } catch (error) {
      next(error);
    }
  };
}
