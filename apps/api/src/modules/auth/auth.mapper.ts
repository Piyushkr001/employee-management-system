import type { AuthenticatedUserDto, EmployeeStatus, UserRole } from "@empnexa/shared";

export type EmployeeAuthProfileRecord = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: EmployeeStatus;
  role: UserRole;
  managerId: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function toAuthenticatedUserDto(
  employee: EmployeeAuthProfileRecord,
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
    status: employee.status,
    role: employee.role,
    managerId: employee.managerId,
    profileImageUrl: employee.profileImageUrl,
    createdAt: employee.createdAt.toISOString(),
    updatedAt: employee.updatedAt.toISOString(),
  };
}
