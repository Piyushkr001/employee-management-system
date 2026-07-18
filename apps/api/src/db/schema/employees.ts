import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  integer,
  uniqueIndex,
  index,
  date,
  AnyPgColumn,
  check,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

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
    phone: varchar("phone", { length: 20 }).notNull(),
    department: varchar("department", { length: 100 }).notNull(),
    designation: varchar("designation", { length: 100 }).notNull(),
    salary: integer("salary").notNull().default(0), // Option A: salaryInPaise as integer (using cents/paise)
    joiningDate: date("joining_date"),
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
      managerIdIdx: index("manager_id_idx").on(table.managerId),
      departmentIdx: index("department_idx").on(table.department),
      roleIdx: index("role_idx").on(table.role),
      statusIdx: index("status_idx").on(table.status),
      joiningDateIdx: index("joining_date_idx").on(table.joiningDate),
      deletedAtIdx: index("deleted_at_idx").on(table.deletedAt),
      salaryCheck: check("salary_check", sql`${table.salary} >= 0`),
    };
  }
);

export const employeesRelations = relations(employees, ({ one, many }) => ({
  manager: one(employees, {
    fields: [employees.managerId],
    references: [employees.id],
    relationName: "manager_reportees",
  }),
  reportees: many(employees, {
    relationName: "manager_reportees",
  }),
}));
