import { AuthRepository } from "./auth.repository";
import { comparePassword } from "../../utils/password";
import { signAccessToken } from "../../utils/jwt";
import { ApiError } from "../../utils/api-error";
import { LoginInput } from "@empnexa/shared";

export class AuthService {
  private repository = new AuthRepository();

  async login(input: LoginInput) {
    // 1. Find employee
    const employee = await this.repository.findEmployeeByEmail(input.email);

    // 2. Return generic error for not found or invalid password
    if (!employee) {
      throw new ApiError(401, "Invalid email or password");
    }

    // 3. Reject inactive employees
    if (employee.status !== "active") {
      throw new ApiError(403, "Account is inactive");
    }

    // 4. Compare password
    const isPasswordValid = await comparePassword(input.password, employee.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    // 5. Generate JWT
    const token = signAccessToken({
      sub: employee.id,
      role: employee.role as any,
      employeeCode: employee.employeeCode,
    });

    // 6. Return sanitized employee data
    const { passwordHash, deletedAt, ...sanitizedEmployee } = employee;

    return {
      token,
      user: sanitizedEmployee,
    };
  }

  async getCurrentUser(userId: string) {
    const employee = await this.repository.findEmployeeById(userId);

    if (!employee) {
      throw new ApiError(401, "User not found");
    }

    if (employee.status !== "active") {
      throw new ApiError(403, "Account is inactive");
    }

    const { passwordHash, deletedAt, ...sanitizedEmployee } = employee;

    return sanitizedEmployee;
  }
}
