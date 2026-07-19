type PostgreSqlError = {
  code?: string;
  constraint?: string;
  detail?: string;
};

export function unwrapPostgreSqlError(error: unknown): PostgreSqlError | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  const candidate = error as {
    code?: string;
    constraint?: string;
    detail?: string;
    cause?: unknown;
  };

  if (candidate.code) {
    return candidate;
  }

  if (typeof candidate.cause === "object" && candidate.cause !== null) {
    const cause = candidate.cause as PostgreSqlError;
    if (cause.code) {
      return cause;
    }
  }

  return null;
}

export function mapDatabaseError(error: unknown): string | null {
  const pgError = unwrapPostgreSqlError(error);
  if (pgError && pgError.code) {
    switch (pgError.code) {
      case "23505": // unique_violation
        if (pgError.constraint === "employees_email_unique") {
          return "EMAIL_ALREADY_EXISTS";
        }
        if (pgError.constraint === "employees_employee_code_unique") {
          return "EMPLOYEE_CODE_ALREADY_EXISTS";
        }
        return "DUPLICATE_RECORD";
      case "23503": // foreign_key_violation
        if (pgError.constraint === "employees_manager_id_employees_id_fk") {
          return "INVALID_MANAGER";
        }
        return "FOREIGN_KEY_VIOLATION";
      case "23514": // check_violation
        if (pgError.constraint === "employees_salary_non_negative") {
          return "NEGATIVE_SALARY";
        }
        if (pgError.constraint === "employees_manager_not_self") {
          return "SELF_MANAGER_NOT_ALLOWED";
        }
        return "CHECK_CONSTRAINT_VIOLATION";
    }
  }
  return null;
}
