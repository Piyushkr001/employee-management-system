export function mapDatabaseError(error: any): string | null {
  if (error && typeof error === "object" && "code" in error) {
    switch (error.code) {
      case "23505": // unique_violation
        if (error.constraint === "employees_email_unique") {
          return "EMAIL_ALREADY_EXISTS";
        }
        if (error.constraint === "employees_employee_code_unique") {
          return "EMPLOYEE_CODE_ALREADY_EXISTS";
        }
        return "DUPLICATE_RECORD";
      case "23503": // foreign_key_violation
        if (error.constraint === "employees_manager_id_employees_id_fk") {
          return "INVALID_MANAGER";
        }
        return "FOREIGN_KEY_VIOLATION";
      case "23514": // check_violation
        if (error.constraint === "employees_salary_non_negative") {
          return "NEGATIVE_SALARY";
        }
        if (error.constraint === "employees_manager_not_self") {
          return "SELF_MANAGER_NOT_ALLOWED";
        }
        return "CHECK_CONSTRAINT_VIOLATION";
    }
  }
  return null;
}
