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

## Endpoints

### Authentication
- `POST /api/auth/login`: Authenticate an employee and return HTTP-only JWT cookie.
- `POST /api/auth/logout`: Clear authentication cookie.
- `GET /api/auth/me`: Get the currently authenticated employee's profile.

### Employees
- `GET /api/employees`: List employees with pagination, search, and filtering. (Protected)
- `POST /api/employees`: Create a new employee. (Requires `super_admin` or `hr_manager`)
- `GET /api/employees/:id`: Get employee details by ID. (Protected)
- `PUT /api/employees/:id`: Update employee details. (Protected, role-dependent restrictions)
- `DELETE /api/employees/:id`: Soft delete an employee. (Requires `super_admin`)
