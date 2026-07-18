import { employees } from "../../db/schema/employees";

type EmployeeRecord = typeof employees.$inferSelect;

export function toEmployeeDto(employee: EmployeeRecord, includeSalary: boolean = false) {
  const { passwordHash, deletedAt, salaryInPaise, ...rest } = employee;

  const dto: any = { ...rest };
  
  if (includeSalary) {
    dto.salary = salaryInPaise / 100;
  }

  // Format dates appropriately
  if (dto.joiningDate instanceof Date) {
    dto.joiningDate = dto.joiningDate.toISOString().split("T")[0];
  }
  
  if (dto.createdAt instanceof Date) {
    dto.createdAt = dto.createdAt.toISOString();
  }
  
  if (dto.updatedAt instanceof Date) {
    dto.updatedAt = dto.updatedAt.toISOString();
  }

  return dto;
}
