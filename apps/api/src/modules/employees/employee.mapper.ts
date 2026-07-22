import { EmployeeMutationRecord, EmployeeDetailRecord, EmployeeListRecord } from "./employee.repository";
import { EmployeeDto } from "@empnexa/shared";

export type EmployeeMapperRecord = EmployeeMutationRecord | EmployeeDetailRecord | EmployeeListRecord;

export type EmployeeMapperOptions = {
  includeSalary?: boolean;
};

export function toEmployeeDto(
  employee: EmployeeMapperRecord, 
  options: EmployeeMapperOptions = {}
): EmployeeDto {
  const emp = employee as Partial<EmployeeDetailRecord & EmployeeMutationRecord>;
  
  const dto: EmployeeDto = {
    id: emp.id!,
    employeeCode: emp.employeeCode!,
    name: emp.name!,
    email: emp.email!,
    phone: emp.phone!,
    department: emp.department!,
    designation: emp.designation!,
    joiningDate: String(emp.joiningDate),
    status: emp.status!,
    role: emp.role!,
    managerId: emp.managerId ?? null,
    profileImageUrl: emp.profileImageUrl ?? null,
    createdAt: emp.createdAt instanceof Date ? emp.createdAt.toISOString() : String(emp.createdAt),
    updatedAt: emp.updatedAt instanceof Date ? emp.updatedAt.toISOString() : String(emp.updatedAt),
  };

  if (emp.manager) {
    dto.manager = emp.manager;
  }
  
  if (options.includeSalary && emp.salaryInPaise !== undefined) {
    dto.salary = emp.salaryInPaise / 100;
  }

  return dto;
}
