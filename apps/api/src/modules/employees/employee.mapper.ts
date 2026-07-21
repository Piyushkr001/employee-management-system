import { EmployeeMutationRecord, EmployeeDetailRecord, EmployeeListRecord } from "./employee.repository";

export function toEmployeeDto(
  employee: EmployeeMutationRecord | EmployeeDetailRecord | EmployeeListRecord, 
  includeSalary: boolean = false
) {
  const emp = employee as Partial<EmployeeDetailRecord & EmployeeMutationRecord>;
  const { passwordHash, deletedAt, salaryInPaise, ...rest } = emp;

  const dto: Record<string, unknown> = { ...rest };
  
  if (includeSalary && salaryInPaise !== undefined) {
    dto.salary = salaryInPaise / 100;
  }

  // Format dates appropriately
  if (dto.joiningDate instanceof Date) {
    dto.joiningDate = (dto.joiningDate as Date).toISOString().split("T")[0];
  }
  
  if (dto.createdAt instanceof Date) {
    dto.createdAt = (dto.createdAt as Date).toISOString();
  }
  
  if (dto.updatedAt instanceof Date) {
    dto.updatedAt = (dto.updatedAt as Date).toISOString();
  }

  return dto;
}
