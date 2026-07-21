import { describe, expect, test } from "bun:test";
import { mapPostgreSqlError, unwrapPostgreSqlError } from "../../src/utils/db-error";

describe("Database Error Mapping", () => {
  test("should unwrap a deeply nested error", () => {
    const rawError = { code: "23505", constraint: "employees_email_unique" };
    const error = {
      cause: {
        cause: rawError
      }
    };
    const unwrapped = unwrapPostgreSqlError(error);
    expect(unwrapped).toEqual(rawError);
  });

  const testCases = [
    {
      name: "Raw unique email error",
      error: { code: "23505", constraint: "employees_email_unique" },
      expectedCode: "EMAIL_ALREADY_EXISTS",
      expectedStatus: 409,
      expectedMessage: "Email is already in use"
    },
    {
      name: "Wrapped unique email error through cause",
      error: { cause: { code: "23505", constraint: "employees_email_unique" } },
      expectedCode: "EMAIL_ALREADY_EXISTS",
      expectedStatus: 409,
      expectedMessage: "Email is already in use"
    },
    {
      name: "Raw Employee Code conflict",
      error: { code: "23505", constraint: "employees_employee_code_unique" },
      expectedCode: "EMPLOYEE_CODE_ALREADY_EXISTS",
      expectedStatus: 409,
      expectedMessage: "Employee Code is already in use"
    },
    {
      name: "Wrapped Employee Code conflict",
      error: { cause: { code: "23505", constraint: "employees_employee_code_unique" } },
      expectedCode: "EMPLOYEE_CODE_ALREADY_EXISTS",
      expectedStatus: 409,
      expectedMessage: "Employee Code is already in use"
    },
    {
      name: "Negative salary constraint",
      error: { code: "23514", constraint: "employees_salary_non_negative" },
      expectedCode: "NEGATIVE_SALARY",
      expectedStatus: 422,
      expectedMessage: "Salary cannot be negative"
    },
    {
      name: "Self-manager constraint",
      error: { code: "23514", constraint: "employees_manager_not_self" },
      expectedCode: "SELF_MANAGER_NOT_ALLOWED",
      expectedStatus: 422,
      expectedMessage: "An employee cannot manage themselves"
    },
    {
      name: "Invalid manager foreign key",
      error: { code: "23503", constraint: "employees_manager_id_employees_id_fk" },
      expectedCode: "INVALID_MANAGER",
      expectedStatus: 422,
      expectedMessage: "Selected manager is invalid"
    },
    {
      name: "Unknown PostgreSQL error",
      error: { code: "57014" }, // query_canceled
      expected: null
    },
    {
      name: "Non-PostgreSQL error",
      error: new Error("Standard error"),
      expected: null
    }
  ];

  for (const tc of testCases) {
    test(tc.name, () => {
      const apiError = mapPostgreSqlError(tc.error);
      if (tc.expected === null) {
        expect(apiError).toBeNull();
      } else {
        expect(apiError).not.toBeNull();
        expect(apiError?.code).toBe(tc.expectedCode);
        expect(apiError?.statusCode).toBe(tc.expectedStatus);
        expect(apiError?.message).toBe(tc.expectedMessage);
      }
    });
  }
});
