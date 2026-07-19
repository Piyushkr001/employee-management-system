import { z } from "zod";
import { UserRole, USER_ROLES } from "../constants/roles";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters"),
});

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginInput = z.output<typeof loginSchema>;

export type AuthenticatedUserDto = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: "active" | "inactive";
  role: UserRole;
  managerId: string | null;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};


