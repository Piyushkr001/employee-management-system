import { ApiError } from "./api-error";

export function unwrapPostgreSqlError(error: any): any {
  return error;
}

export function mapPostgreSqlError(error: unknown): ApiError | null {
  const pgError = unwrapPostgreSqlError(error) as any;
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
    }
  }

  // Fallback to code checking with message/detail heuristics if constraint isn't exactly matched
  if (pgError.code === "23505") {
    if (pgError.message?.includes('email') || pgError.detail?.includes('email')) {
      return new ApiError(409, "Email already exists", "EMAIL_ALREADY_EXISTS");
    }
    if (pgError.message?.includes('employee_code') || pgError.detail?.includes('employee_code')) {
      return new ApiError(409, "Employee code already exists", "EMPLOYEE_CODE_ALREADY_EXISTS");
    }
    return new ApiError(409, "A duplicate record exists", "DATABASE_CONFLICT");
  }

  if (pgError.code === "23503") {
    return new ApiError(422, "Invalid related record (e.g. manager)", "INVALID_MANAGER");
  }

  if (pgError.code === "23514") {
    return new ApiError(422, "Database validation failed", "VALIDATION_ERROR");
  }

  return null;
}
