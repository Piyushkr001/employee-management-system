import { relations, sql } from "drizzle-orm";
import {
  AnyPgColumn,
  check,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const employeeRoleEnum = pgEnum("employee_role", [
  "super_admin",
  "hr_manager",
  "employee",
]);

export const employeeStatusEnum = pgEnum("employee_status", [
  "active",
  "inactive",
]);

export const employees = pgTable(
  "employees",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    employeeCode: varchar("employee_code", {
      length: 30,
    }).notNull(),

    name: varchar("name", {
      length: 100,
    }).notNull(),

    email: varchar("email", {
      length: 255,
    }).notNull(),

    passwordHash: text("password_hash").notNull(),

    phone: varchar("phone", {
      length: 20,
    }).notNull(),

    department: varchar("department", {
      length: 100,
    }).notNull(),

    designation: varchar("designation", {
      length: 100,
    }).notNull(),

    salaryInPaise: integer("salary_in_paise").notNull(),

    joiningDate: date("joining_date").notNull(),

    status: employeeStatusEnum("status")
      .default("active")
      .notNull(),

    role: employeeRoleEnum("role")
      .default("employee")
      .notNull(),

    managerId: uuid("manager_id").references(
      (): AnyPgColumn => employees.id,
    ),

    profileImageUrl: text("profile_image_url"),

    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
    }),

    createdAt: timestamp("created_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    employeeCodeUnique: uniqueIndex("employees_employee_code_unique").on(
      table.employeeCode,
    ),

    emailUnique: uniqueIndex("employees_email_unique").on(table.email),

    managerIdIdx: index("employees_manager_id_idx").on(table.managerId),
    departmentIdx: index("employees_department_idx").on(table.department),
    roleIdx: index("employees_role_idx").on(table.role),
    statusIdx: index("employees_status_idx").on(table.status),
    joiningDateIdx: index("employees_joining_date_idx").on(table.joiningDate),
    deletedAtIdx: index("employees_deleted_at_idx").on(table.deletedAt),

    salaryNonNegative: check(
      "employees_salary_non_negative",
      sql`${table.salaryInPaise} >= 0`,
    ),

    managerNotSelf: check(
      "employees_manager_not_self",
      sql`${table.managerId} IS NULL OR ${table.managerId} <> ${table.id}`,
    ),
  }),
);

export const employeesRelations = relations(
  employees,
  ({ one, many }) => ({
    manager: one(employees, {
      fields: [employees.managerId],
      references: [employees.id],
      relationName: "employee_manager",
    }),

    reportees: many(employees, {
      relationName: "employee_manager",
    }),
  }),
);
