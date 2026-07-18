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
      role: employee.role,
      employeeCode: employee.employeeCode,
    });

    // 6. Map to DTO (ensures salary and passwordHash are excluded)
    // We explicitly exclude the passwordHash to cast to the full record type for mapper if needed,
    // though findEmployeeForLoginByEmail excludes salary, we can safely cast it.
    const userDto = toAuthenticatedUserDto(employee as any);

    return {
      token,
      user: userDto,
    };
  }

  async getCurrentUser(userId: string) {
    const employee = await this.repository.findFullEmployeeById(userId);

    if (!employee) {
      throw new ApiError(401, "User not found");
    }

    if (employee.status !== "active") {
      throw new ApiError(403, "Account is inactive");
    }

    return toAuthenticatedUserDto(employee);
  }
}
