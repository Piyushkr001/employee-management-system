import { AuthRepository } from "./auth.repository";
import { comparePassword } from "../../utils/password";
import { signAccessToken } from "../../utils/jwt";
import { ApiError } from "../../utils/api-error";
import { LoginInput } from "@empnexa/shared";
import { toAuthenticatedUserDto } from "./auth.mapper";

export class AuthService {
  private repository = new AuthRepository();

  async login(input: LoginInput) {
    // 1. Find employee (without salary)
    const employee = await this.repository.findEmployeeForLoginByEmail(input.email);

    // 2. Return generic error for not found
    if (!employee) {
      throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    // 3. Compare password BEFORE checking active status to prevent enumeration
    const isPasswordValid = await comparePassword(input.password, employee.passwordHash);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    // 4. Reject inactive employees
    if (employee.status !== "active") {
      throw new ApiError(403, "Account is inactive", "ACCOUNT_INACTIVE");
    }

    // 5. Generate JWT
    const token = signAccessToken({
      sub: employee.id,
      role: employee.role,
      employeeCode: employee.employeeCode,
    });

    // 6. Map to DTO (ensures salary and passwordHash are excluded)
    const userDto = toAuthenticatedUserDto(employee);

    return {
      token,
      user: userDto,
    };
  }
}
