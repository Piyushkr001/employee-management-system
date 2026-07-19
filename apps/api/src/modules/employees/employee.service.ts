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

  async validateManagerAssignment(employeeId: string, proposedManagerId: string | null) {
    if (!proposedManagerId) {
      return;
    }

    if (proposedManagerId === employeeId) {
      throw new ApiError(422, "Employee cannot manage themselves", "INVALID_MANAGER");
    }

    let currentManagerId: string | null = proposedManagerId;
    const visited = new Set<string>();

    while (currentManagerId) {
      if (currentManagerId === employeeId) {
        throw new ApiError(409, "Circular reporting structure detected", "CIRCULAR_REPORTING");
      }
      if (visited.has(currentManagerId)) {
        throw new ApiError(409, "Corrupted hierarchy detected", "CIRCULAR_REPORTING");
      }
      visited.add(currentManagerId);

      const manager = await this.repository.findManagerIdentityById(currentManagerId);
      if (!manager || manager.deletedAt) {
        throw new ApiError(422, "Invalid manager ID or manager is deleted", "INVALID_MANAGER");
      }
      if (manager.status !== "active") {
        throw new ApiError(422, "Manager must be active", "INVALID_MANAGER");
      }

      currentManagerId = manager.managerId;
    }
  }

  async create(input: CreateEmployeeInput) {
    try {
      // Validate manager if provided
      if (input.managerId) {
        // use a fake id that will never match a real manager ID for cycle check on creation
        await this.validateManagerAssignment("NEW_EMPLOYEE", input.managerId);
      }

      const hashedPassword = await hashPassword(input.password);
      const salaryInPaise = Math.round(input.salary * 100);

      const { password, salary, ...restInput } = input;

      const newEmployee = await this.repository.create({
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

  async update(id: string, input: UpdateEmployeeInput, actorRole: UserRole) {
    try {
      const employee = await this.repository.findById(id);
      if (!employee) {
        throw new ApiError(404, "Employee not found", "EMPLOYEE_NOT_FOUND");
      }

      // Validate manager if provided
      if (input.managerId !== undefined) {
        await this.validateManagerAssignment(id, input.managerId);
      }

      const updateData: any = { ...input };

      if (input.salary !== undefined) {
        updateData.salaryInPaise = Math.round(input.salary * 100);
        delete updateData.salary;
      }

      let updatedEmployee;
      
      const removesActiveSuperAdmin =
        employee.role === "super_admin" &&
        employee.status === "active" &&
        employee.deletedAt === null &&
        ((input.role !== undefined && input.role !== "super_admin") ||
         (input.status !== undefined && input.status !== "active"));

      if (removesActiveSuperAdmin) {
        try {
          updatedEmployee = await this.repository.updateWithSuperAdminCheck(id, updateData);
        } catch (e: any) {
          if (e.message === "LAST_ACTIVE_SUPER_ADMIN") {
            throw new ApiError(409, "Cannot demote or deactivate the last active Super Admin", "LAST_ACTIVE_SUPER_ADMIN");
          }
          throw e;
        }
      } else {
        updatedEmployee = await this.repository.update(id, updateData);
      }
      const includeSalary = actorRole === "super_admin" || actorRole === "hr_manager";
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
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new ApiError(404, "Employee not found", "EMPLOYEE_NOT_FOUND");
    }

    const reporteeCount = await this.repository.countReportees(id);
    if (reporteeCount > 0) {
      throw new ApiError(409, "Cannot delete employee because they have reportees. Reassign them first.", "EMPLOYEE_HAS_REPORTEES");
    }

    const removesActiveSuperAdmin = 
      employee.role === "super_admin" && 
      employee.status === "active" && 
      employee.deletedAt === null;

    if (removesActiveSuperAdmin) {
      try {
        await this.repository.softDeleteWithSuperAdminCheck(id);
      } catch (e: any) {
        if (e.message === "LAST_ACTIVE_SUPER_ADMIN") {
          throw new ApiError(409, "Cannot delete the last active Super Admin", "LAST_ACTIVE_SUPER_ADMIN");
        }
        throw e;
      }
    } else {
      await this.repository.softDelete(id);
    }
    return { success: true };
  }
}
