# EmpNexa API Documentation

## Standard Response Format

All API responses follow a strict `ApiResponse<T>` contract:

```typescript
type ApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string;
    fieldErrors?: Record<string, string[]>;
  };
};
```

### Standardized Error Codes

Common error codes returned in the `error.code` payload:
- `UNAUTHENTICATED`: No token provided.
- `INVALID_TOKEN`: Token signature is invalid or expired.
- `INVALID_SESSION`: The associated employee was deleted.
- `ACCOUNT_INACTIVE`: The associated employee is inactive.
- `VALIDATION_ERROR`: Zod schema parsing failed.
- `CIRCULAR_REPORTING`: Attempted to create an infinite manager cycle.
- `LAST_ACTIVE_SUPER_ADMIN`: Attempted to remove the only active Super Admin.

## Endpoints

### Authentication
- `POST /api/auth/login`: Authenticate an employee and return HTTP-only JWT cookie.
- `POST /api/auth/logout`: Clear authentication cookie.
- `GET /api/auth/me`: Get the currently authenticated employee's profile.

### Employees
- `GET /api/employees`: List employees with pagination, search, and filtering. (Protected)
- `GET /api/employees/manager-options`: Fetch active employees eligible to be managers, avoiding circular reporting cycles. (Protected)
- `POST /api/employees`: Create a new employee. (Requires `super_admin` or `hr_manager`)
- `GET /api/employees/:id`: Get employee details by ID. (Protected)
- `PUT /api/employees/:id`: Update employee details. (Protected, role-dependent restrictions)
- `DELETE /api/employees/:id`: Soft delete an employee. (Requires `super_admin`)

## Security

- Authentication uses HTTP-only cookies.
- Cookie name is shared between frontend and backend via `AUTH_COOKIE_NAME` environment variable (defaults to `empnexa_token`).
- `employeeCode` is strictly immutable after creation.
- Hierarchy operations (assigning managers, soft deleting) are protected by a Postgres advisory transaction lock (`EMPLOYEE_HIERARCHY_LOCK_KEY`) to prevent concurrent circular reporting and race conditions.
- Super Admin demotion/deactivation checks are protected via `FOR UPDATE` row-level locks ensuring at least one active Super Admin always exists.
