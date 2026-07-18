import type { AuthenticatedUserDto } from "@empnexa/shared";
import type { employees } from "../../db/schema";

type EmployeeRecord = typeof employees.$inferSelect;

export function toAuthenticatedUserDto(
  employee: EmployeeRecord,
): AuthenticatedUserDto {
  return {
    id: employee.id,
    employeeCode: employee.employeeCode,
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    joiningDate: employee.joiningDate,
    status: employee.status as any, // Mapped to correct literal via schema types if needed, but safe
    role: employee.role as any,
    managerId: employee.managerId,
    profileImageUrl: employee.profileImageUrl,
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}
