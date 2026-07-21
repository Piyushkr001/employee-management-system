import { ApiError } from "./api-error";

type PostgreSqlErrorLike = {
  code?: string;
  constraint?: string;
  constraint_name?: string;
  detail?: string;
  message?: string;
  cause?: unknown;
};

export function unwrapPostgreSqlError(error: unknown): PostgreSqlErrorLike | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const candidate = error as PostgreSqlErrorLike;

  if (candidate.code || candidate.constraint || candidate.constraint_name) {
    return candidate;
  }

  if (candidate.cause) {
    return unwrapPostgreSqlError(candidate.cause);
  }

  return null;
}

export function mapPostgreSqlError(error: unknown): ApiError | null {
  const pgError = unwrapPostgreSqlError(error);
  if (!pgError) return null;

  const constraint = pgError.constraint || pgError.constraint_name;

  if (constraint) {
    switch (constraint) {
      case "employees_email_unique":
        return new ApiError(409, "Email is already in use", "EMAIL_ALREADY_EXISTS");
      case "employees_employee_code_unique":
        return new ApiError(409, "Employee Code is already in use", "EMPLOYEE_CODE_ALREADY_EXISTS");
      case "employees_salary_non_negative":
        return new ApiError(422, "Salary cannot be negative", "NEGATIVE_SALARY");
      case "employees_manager_not_self":
        return new ApiError(422, "An employee cannot manage themselves", "SELF_MANAGER_NOT_ALLOWED");
      case "employees_manager_id_employees_id_fk":
        return new ApiError(422, "Selected manager is invalid", "INVALID_MANAGER");
    }
  }

  if (pgError.code === "23505") {
    if (pgError.message?.includes('email') || pgError.detail?.includes('email')) {
      return new ApiError(409, "Email is already in use", "EMAIL_ALREADY_EXISTS");
    }
    if (pgError.message?.includes('employee_code') || pgError.detail?.includes('employee_code')) {
      return new ApiError(409, "Employee Code is already in use", "EMPLOYEE_CODE_ALREADY_EXISTS");
    }
    return new ApiError(409, "A duplicate record exists", "DATABASE_CONFLICT");
  }

  if (pgError.code === "23503") {
    return new ApiError(422, "Selected manager is invalid", "INVALID_MANAGER");
  }

  if (pgError.code === "23514") {
    return new ApiError(422, "Database validation failed", "VALIDATION_ERROR");
  }

  return null;
}
