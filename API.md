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
- `VALIDATION_ERROR`: Zod schema parsing failed (Returns HTTP 422).
- `CIRCULAR_REPORTING`: Attempted to create an infinite manager cycle.
- `LAST_ACTIVE_SUPER_ADMIN`: Attempted to remove the only active Super Admin.
- `INVALID_ORIGIN`: Cross-Origin request failed CORS or CSRF check.
- `INVALID_CONTENT_TYPE`: Request body must be application/json.
- `INVALID_REQUEST_HEADER`: Missing X-EmpNexa-Request header for mutations.
- `FORBIDDEN`: User does not have permission for this operation.
- `FORBIDDEN_FIELD`: User does not have permission to modify specific fields.
- `CANNOT_MODIFY_SUPER_ADMIN`: User attempted to modify a Super Admin without permission.
- `MANAGER_HAS_ACTIVE_REPORTEES`: Attempted to deactivate a manager that still has active direct reports.
- `EMPLOYEE_HAS_REPORTEES`: Attempted to soft delete a manager with active direct reportees.
- `EMPLOYEE_NOT_FOUND`: The requested employee does not exist (Returns HTTP 404).
- `NOT_FOUND`: Route does not exist (Returns HTTP 404).
- `EMAIL_ALREADY_EXISTS`: Registration failed because email is already in use.
- `EMPLOYEE_CODE_ALREADY_EXISTS`: Employee code is already in use.
- `NEGATIVE_SALARY`: Employee salary constraint violated.
- `SELF_MANAGER_NOT_ALLOWED`: Employee cannot manage themselves.
- `INVALID_MANAGER`: Manager lookup failed or is soft-deleted.

## Endpoints

### Authentication
- `POST /api/auth/login`: Authenticate an employee and return HTTP-only JWT cookie.
- `POST /api/auth/logout`: Clear authentication cookie.
- `GET /api/auth/me`: Get the currently authenticated employee's profile.

### Employees
- `GET /api/employees`: List employees with pagination, search, and filtering. (Protected, HR Manager & Super Admin only)
- `GET /api/employees/manager-options`: Searches active, non-deleted manager candidates. (Note: does *not* recursively remove all circular-reporting candidates—circular assignments are fully rejected during the update transaction). (Protected, HR Manager & Super Admin only)
- `GET /api/employees/manager-options/:id`: Resolves one non-deleted Employee label by ID. May be used to restore a selected filter label. (Protected, HR Manager & Super Admin only)
- `POST /api/employees`: Create a new employee. (Requires `super_admin` or `hr_manager`)
- `GET /api/employees/:id`: Get employee details by ID. (Protected, HR Manager & Super Admin only, or self)
- `PUT /api/employees/:id`: Update employee details. (Protected, role-dependent restrictions)
- `DELETE /api/employees/:id`: Soft delete an employee. (Requires `super_admin`)

## Security

- Authentication uses HTTP-only cookies.
- Frontend leverages a Next.js API proxy (`/backend/*`) to ensure all API calls are Same-Origin, eliminating CORS preflight overhead and enhancing cookie security.
- Cookie name is shared between frontend and backend. Backend uses `COOKIE_NAME`, frontend uses `AUTH_COOKIE_NAME` environment variable (defaults to `empnexa_token`). The values must match identically.
- `employeeCode` is strictly immutable after creation.
- Hierarchy operations (assigning managers, soft deleting) are protected by a Postgres advisory transaction lock (`EMPLOYEE_HIERARCHY_LOCK_KEY`) to prevent concurrent circular reporting and race conditions.
- Super Admin demotion/deactivation and general updates/deletions are strictly authorized via a locked-actor architecture. The system uses a `FOR UPDATE` row-level lock on the actor performing the action to validate the absolute latest actor state (e.g. active, not demoted).
- `API_INTERNAL_URL` is mandatory in production for Server Components to resolve backend absolute paths. Browser components use `NEXT_PUBLIC_API_URL=/backend`.
