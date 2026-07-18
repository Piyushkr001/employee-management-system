import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { ZodError } from "zod";

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
      const parsedData = await schema.parseAsync(req[location]);

      req[location] = parsedData as never;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(422).json({
          success: false,
          message: "Validation failed",
          error: {
            code: "VALIDATION_ERROR",
            fieldErrors: error.flatten().fieldErrors,
          },
        });
      }

      next(error);
    }
  };
}
