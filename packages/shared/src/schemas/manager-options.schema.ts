import { z } from "zod";

export const managerOptionsQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(100)
    .optional(),

  excludeEmployeeId: z
    .string()
    .uuid("Invalid employee ID")
    .optional(),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(100),
});

export type ManagerOptionsQuery = z.infer<typeof managerOptionsQuerySchema>;
