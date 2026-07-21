import { employees } from "../../db/schema/employees";

import { EmployeeMutationRecord, EmployeeDetailRecord } from "./employee.repository";

export function toEmployeeDto(employee: EmployeeMutationRecord | EmployeeDetailRecord, includeSalary: boolean = false) {
  const { passwordHash, deletedAt, salaryInPaise, ...rest } = employee as any;

  const dto: any = { ...rest };
  
  if (includeSalary) {
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
