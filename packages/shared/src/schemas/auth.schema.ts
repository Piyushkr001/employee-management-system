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

export type LoginInput = z.infer<typeof loginSchema>;

export type AuthenticatedUser = {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: Date | null;
  status: "active" | "inactive";
  role: UserRole;
  managerId: string | null;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code?: string;
    fieldErrors?: Record<string, string[]>;
  };
};
