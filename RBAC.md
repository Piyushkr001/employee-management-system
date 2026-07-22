# EmpNexa Role-Based Access Control (RBAC)

The system utilizes three distinct roles with hierarchical permissions:

## Super Admin (`super_admin`)
The highest level of access. Can manage all aspects of the system.
- Can create, read, update, and soft-delete any employee.
- Can promote users to `super_admin`.
- **Protection**: The system prevents soft-deleting or demoting the last active Super Admin.

## HR Manager (`hr_manager`)
Administrative access for managing standard employees.
- Can create, read, and update regular employees and other HR managers.
- Cannot create, modify, or delete Super Admins.
- Cannot soft-delete any users.

## Employee (`employee`)
Standard access for regular staff.
- Can view and update their own profile and contact information (`phone`, `profileImageUrl`).
- Cannot view the employee directory or organization hierarchy.
- Cannot view sensitive information like salaries of other employees.

## Hierarchy Rules
- A user cannot be assigned a manager who reports to them (Circular Manager Prevention).
- System access role and organizational reporting hierarchy are independent concepts.

## Salary Visibility
- Salaries are strictly hidden from standard `employee` role across all API responses (e.g. `GET /api/employees`, `GET /api/employees/:id`, `PUT /api/employees/:id`).
- Only `super_admin` and `hr_manager` roles receive salary data in API responses.
- The `GET /api/auth/me` endpoint explicitly strips salary information, regardless of role, as it is only intended for frontend identity.

## Immutability & Rejection Rules
- `employeeCode` is immutable after creation and cannot be updated by any role.
- Attempts to update forbidden fields explicitly return `403 Forbidden` rather than silently ignoring the update (e.g. HR trying to assign a Super Admin role, or Employee trying to update their own salary).
- Password hashes and other sensitive server-side fields are never exposed in the employee list selection payload.
- **Locked-Actor Authorization**: Updates and deletions are strictly authorized against the `lockedActor` retrieved via a database advisory lock and `SELECT ... FOR UPDATE` within the transaction. 
  - To prevent deadlock, the actor row and target row are ordered by ID before locking. 
  - This guarantees that authorization (e.g. checking if the actor is demoted to `employee` before allowing them to update another user) and response formatting (e.g. whether to include the `salary` field) is based on the absolute latest actor state, preventing race-condition stale-actor bugs.
