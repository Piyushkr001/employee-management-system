import { EmployeeRepository, EmployeeListRecord, EmployeeDetailRecord, EmployeeMutationRecord } from "./employee.repository";
import { ApiError } from "../../utils/api-error";
import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeListQuery, UserRole } from "@empnexa/shared";
import { hashPassword } from "../../utils/password";
import { toEmployeeDto } from "./employee.mapper";
import { mapPostgreSqlError } from "../../utils/db-error";

type NewEmployeeInput = Omit<EmployeeMutationRecord, "id" | "createdAt" | "updatedAt" | "deletedAt">;

export class EmployeeService {
  private repository = new EmployeeRepository();

  async getPaginated(query: EmployeeListQuery, actorRole: UserRole) {
    const result = await this.repository.getPaginated(query);
    const includeSalary = actorRole === "super_admin" || actorRole === "hr_manager";
    
    return {
      employees: result.employees.map((emp) => toEmployeeDto(emp, includeSalary)),
      pagination: result.pagination
    };
  }

  async getManagerOptions(query: { search?: string; excludeEmployeeId?: string; limit?: number }) {
    return await this.repository.getManagerOptions(query);
  }

  async getManagerOptionById(id: string) {
    const manager = await this.repository.getManagerOptionById(id);
    if (!manager) {
      throw new ApiError(404, "Manager not found", "EMPLOYEE_NOT_FOUND");
    }
    return manager;
  }

  async getById(id: string, actorRole: UserRole) {
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new ApiError(404, "Employee not found", "EMPLOYEE_NOT_FOUND");
    }

    const includeSalary = actorRole === "super_admin" || actorRole === "hr_manager";
    return toEmployeeDto(employee, includeSalary);
  }

  async create(input: CreateEmployeeInput, actor: { id: string; role: UserRole }) {
    const hashedPassword = await hashPassword(input.password);
    const salaryInPaise = Math.round(input.salary * 100);

    const { password, salary, ...restInput } = input;

    const newEmployeeData: NewEmployeeInput = {
      ...restInput,
      passwordHash: hashedPassword,
      salaryInPaise,
      joiningDate: input.joiningDate,
      profileImageUrl: input.profileImageUrl ?? null,
      managerId: input.managerId ?? null,
    };

      const newEmployee = await this.repository.createEmployeeTransactionSafe(newEmployeeData, actor);

      return toEmployeeDto(newEmployee, true);
  }

  async update(id: string, input: UpdateEmployeeInput, actor: { id: string; role: UserRole }) {
    const updateData: Partial<NewEmployeeInput> = { ...input } as any;

    if (input.salary !== undefined) {
      updateData.salaryInPaise = Math.round(input.salary * 100);
      delete (updateData as any).salary;
    }

      const updatedEmployee = await this.repository.updateEmployeeTransactionSafe(id, updateData, actor);
      
      const includeSalary = actor.role === "super_admin" || actor.role === "hr_manager";
      return toEmployeeDto(updatedEmployee, includeSalary);
  }

  async softDelete(id: string, actor: { id: string; role: UserRole }) {
    await this.repository.softDelete(id, actor);
    return { success: true };
  }
}
