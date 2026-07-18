import { EmployeeRepository } from "./employee.repository";
import { ApiError } from "../../utils/api-error";
import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeListQuery, UserRole } from "@empnexa/shared";
import { hashPassword } from "../../utils/password";
import { toEmployeeDto } from "./employee.mapper";

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

  async getById(id: string, actorRole: UserRole) {
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    const includeSalary = actorRole === "super_admin" || actorRole === "hr_manager";
    return toEmployeeDto(employee as any, includeSalary);
  }

  async create(input: CreateEmployeeInput) {
    // Check email uniqueness
    const existingEmail = await this.repository.findByEmail(input.email);
    if (existingEmail) {
      throw new ApiError(409, "Email already exists", "EMAIL_ALREADY_EXISTS");
    }

    // Check employee code uniqueness
    const existingCode = await this.repository.findByEmployeeCode(input.employeeCode);
    if (existingCode) {
      throw new ApiError(409, "Employee code already exists", "EMPLOYEE_CODE_ALREADY_EXISTS");
    }

    // Validate manager if provided
    if (input.managerId) {
      const manager = await this.repository.findById(input.managerId);
      if (!manager) {
        throw new ApiError(422, "Invalid manager ID", "INVALID_MANAGER");
      }
      if (manager.status !== "active") {
        throw new ApiError(422, "Manager must be active", "INVALID_MANAGER");
      }
    }

    const hashedPassword = await hashPassword(input.password);
    const salaryInPaise = Math.round(input.salary * 100);

    const { password, salary, ...restInput } = input;

    const newEmployee = await this.repository.create({
      ...restInput,
      passwordHash: hashedPassword,
      salaryInPaise,
      // Default dates
      joiningDate: input.joiningDate,
    } as any);

    return toEmployeeDto(newEmployee as any, true);
  }

  async update(id: string, input: UpdateEmployeeInput, actorRole: UserRole) {
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    // Uniqueness checks if updating unique fields
    if (input.email && input.email !== employee.email) {
      const existingEmail = await this.repository.findByEmail(input.email);
      if (existingEmail) {
        throw new ApiError(409, "Email already exists", "EMAIL_ALREADY_EXISTS");
      }
    }

    if (input.employeeCode && input.employeeCode !== employee.employeeCode) {
      const existingCode = await this.repository.findByEmployeeCode(input.employeeCode);
      if (existingCode) {
        throw new ApiError(409, "Employee code already exists", "EMPLOYEE_CODE_ALREADY_EXISTS");
      }
    }

    // Validate manager if provided
    if (input.managerId !== undefined && input.managerId !== null) {
      if (input.managerId === id) {
        throw new ApiError(422, "Employee cannot manage themselves", "INVALID_MANAGER");
      }
      const manager = await this.repository.findById(input.managerId);
      if (!manager) {
        throw new ApiError(422, "Invalid manager ID", "INVALID_MANAGER");
      }
    }

    const updateData: any = { ...input };

    if (input.salary !== undefined) {
      updateData.salaryInPaise = Math.round(input.salary * 100);
      delete updateData.salary;
    }

    const updatedEmployee = await this.repository.update(id, updateData);
    const includeSalary = actorRole === "super_admin" || actorRole === "hr_manager";
    return toEmployeeDto(updatedEmployee as any, includeSalary);
  }

  async softDelete(id: string) {
    const employee = await this.repository.findById(id);
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    if (employee.role === "super_admin") {
      const activeSuperAdmins = await this.repository.countActiveSuperAdmins();
      if (activeSuperAdmins <= 1) {
        throw new ApiError(403, "Cannot delete the last active Super Admin", "LAST_SUPER_ADMIN");
      }
    }

    const reporteeCount = await this.repository.countReportees(id);
    if (reporteeCount > 0) {
      throw new ApiError(409, "Cannot delete employee because they have reportees. Reassign them first.", "EMPLOYEE_HAS_REPORTEES");
    }

    await this.repository.softDelete(id);
    return { success: true };
  }
}
