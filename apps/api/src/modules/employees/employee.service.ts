import { EmployeeRepository } from "./employee.repository";
import { ApiError } from "../../utils/api-error";
import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeListQuery, UserRole } from "@empnexa/shared";
import { hashPassword } from "../../utils/password";
import { toEmployeeDto } from "./employee.mapper";
import { mapDatabaseError } from "../../utils/database-error";

export class EmployeeService {
  private repository = new EmployeeRepository();

  async getPaginated(query: EmployeeListQuery, actorRole: UserRole) {
    const result = await this.repository.getPaginated(query);
    const includeSalary = actorRole === "super_admin" || actorRole === "hr_manager";
    
    return {
      employees: result.employees.map(emp => toEmployeeDto(emp as any, includeSalary)),
      pagination: result.pagination
    };
  }

  async getManagerOptions(query: { search?: string; excludeEmployeeId?: string; limit?: number }) {
    return await this.repository.getManagerOptions(query);
  }

  async getById(id: string, actorRole: UserRole) {
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new ApiError(404, "Employee not found", "EMPLOYEE_NOT_FOUND");
    }

    const includeSalary = actorRole === "super_admin" || actorRole === "hr_manager";
    return toEmployeeDto(employee as any, includeSalary);
  }

  async create(input: CreateEmployeeInput) {
    try {
      const hashedPassword = await hashPassword(input.password);
      const salaryInPaise = Math.round(input.salary * 100);

      const { password, salary, ...restInput } = input;

      const newEmployee = await this.repository.createEmployeeTransactionSafe({
        ...restInput,
        passwordHash: hashedPassword,
        salaryInPaise,
        joiningDate: input.joiningDate,
      } as any);

      return toEmployeeDto(newEmployee as any, true);
    } catch (error: any) {
      const dbError = mapDatabaseError(error);
      if (dbError) {
        const status = ["INVALID_MANAGER", "NEGATIVE_SALARY", "SELF_MANAGER_NOT_ALLOWED"].includes(dbError) ? 422 : 409;
        throw new ApiError(status, "Database conflict", dbError);
      }
      throw error;
    }
  }

  async update(id: string, input: UpdateEmployeeInput, actor: { id: string; role: UserRole }) {
    try {
      const updateData: any = { ...input };

      if (input.salary !== undefined) {
        updateData.salaryInPaise = Math.round(input.salary * 100);
        delete updateData.salary;
      }

      const updatedEmployee = await this.repository.updateEmployeeTransactionSafe(id, updateData, actor);
      
      const includeSalary = actor.role === "super_admin" || actor.role === "hr_manager";
      return toEmployeeDto(updatedEmployee as any, includeSalary);
    } catch (error: any) {
      const dbError = mapDatabaseError(error);
      if (dbError) {
        const status = ["INVALID_MANAGER", "NEGATIVE_SALARY", "SELF_MANAGER_NOT_ALLOWED"].includes(dbError) ? 422 : 409;
        throw new ApiError(status, "Database conflict", dbError);
      }
      throw error;
    }
  }

  async softDelete(id: string) {
    await this.repository.softDelete(id);
    return { success: true };
  }
}
