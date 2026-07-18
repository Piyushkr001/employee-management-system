import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  integer,
  uniqueIndex,
  AnyPgColumn,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["super_admin", "hr_manager", "employee"]);
export const statusEnum = pgEnum("status", ["active", "inactive"]);

export const employees = pgTable(
  "employees",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    employeeCode: varchar("employee_code", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    department: varchar("department", { length: 100 }),
    designation: varchar("designation", { length: 100 }),
    salary: integer("salary").notNull().default(0), // Can store as cents/paisa if needed
    joiningDate: timestamp("joining_date"),
    status: statusEnum("status").notNull().default("active"),
    role: roleEnum("role").notNull().default("employee"),
    managerId: uuid("manager_id").references((): AnyPgColumn => employees.id),
    profileImageUrl: varchar("profile_image_url", { length: 255 }),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("email_idx").on(table.email),
      employeeCodeIdx: uniqueIndex("employee_code_idx").on(table.employeeCode),
    };
  }
);
