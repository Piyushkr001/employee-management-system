import { z } from "zod";
import { EMPLOYEE_SORT_FIELDS, SORT_ORDERS, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "../constants/employee";

export const employeeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PAGE_SIZE)
    .default(DEFAULT_PAGE_SIZE),

  search: z.string().trim().max(100).optional(),

  department: z
    .string()
    .trim()
    .max(100)
    .optional(),

  designation: z
    .string()
    .trim()
    .max(100)
    .optional(),

  status: z
    .enum(["active", "inactive"])
    .optional(),

  role: z
    .enum([
      "super_admin",
      "hr_manager",
      "employee",
    ])
    .optional(),

  managerId: z.string().uuid().optional(),

  sortBy: z
    .enum(EMPLOYEE_SORT_FIELDS)
    .default("createdAt"),

  sortOrder: z
    .enum(SORT_ORDERS)
    .default("desc"),
});

export type EmployeeListQuery = z.infer<typeof employeeListQuerySchema>;

export const employeeIdParamsSchema = z.object({
  id: z.string().uuid("Invalid employee ID"),
});

export type EmployeeIdParams = z.infer<typeof employeeIdParamsSchema>;

export const createEmployeeSchema = z.object({
  employeeCode: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .transform((value) => value.toUpperCase()),

  name: z.string().trim().min(2).max(100),

  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8)
    .max(128),

  phone: z.string().trim().min(7).max(20),

  department: z.string().trim().min(2).max(100),

  designation: z.string().trim().min(2).max(100),

  salary: z.number().nonnegative().max(100000000),

  joiningDate: z
    .string()
    .date("Joining date must use YYYY-MM-DD"),

  status: z
    .enum(["active", "inactive"])
    .default("active"),

  role: z
    .enum([
      "super_admin",
      "hr_manager",
      "employee",
    ])
    .default("employee"),

  managerId: z.string().uuid().nullable().optional(),

  profileImageUrl: z
    .string()
    .url()
    .nullable()
    .optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
  // Override specific fields that shouldn't be partially updatable in the same way or
  // add fields if necessary. 
  // We strictly omit sensitive fields from even being processed via Omit if needed,
  // but since createEmployeeSchema doesn't have passwordHash, deletedAt, etc., it's safe.
}).omit({
  // We do not want passwords updatable via the standard edit employee endpoint during this phase
  password: true,
});

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;

export type EmployeeStatus = "active" | "inactive";
