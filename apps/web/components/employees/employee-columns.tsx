"use client";

import { EmployeeDto } from "@/features/employees/employee.api";
import { EmployeeStatusBadge } from "./employee-status-badge";
import { EmployeeRoleBadge } from "./employee-role-badge";

// In a real application with Shadcn Data Table we would use ColumnDef from @tanstack/react-table.
// For simplicity in this bespoke table we just define our columns.
export const columns = [
  { header: "Employee", key: "name" },
  { header: "Code", key: "employeeCode" },
  { header: "Department", key: "department" },
  { header: "Designation", key: "designation" },
  { header: "Role", key: "role" },
  { header: "Status", key: "status" },
  { header: "Joining Date", key: "joiningDate" },
  { header: "Salary", key: "salary" },
  { header: "Actions", key: "actions" },
];
