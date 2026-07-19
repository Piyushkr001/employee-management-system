import { testDb } from "./test-db";
import { employees } from "../../src/db/schema";
import { hashPassword } from "../../src/utils/password";

let employeeCounter = 0;

export async function createTestEmployee(overrides: Partial<typeof employees.$inferInsert> = {}) {
  const uniqueId = Date.now().toString() + Math.random().toString().slice(2, 6) + (++employeeCounter);
  const passwordHash = overrides.passwordHash || await hashPassword("Test@123");

  const [employee] = await testDb.insert(employees).values({
    employeeCode: `EMP${uniqueId}`,
    name: "Test Employee",
    email: `test${uniqueId}@empnexa.com`,
    passwordHash,
    phone: "+1234567890",
    department: "Engineering",
    designation: "Software Engineer",
    salaryInPaise: 1000000,
    joiningDate: "2026-01-01",
    status: "active",
    role: "employee",
    ...overrides,
  }).returning();

  return employee;
}

export async function createActiveSuperAdmin(overrides: Partial<typeof employees.$inferInsert> = {}) {
  return createTestEmployee({
    role: "super_admin",
    status: "active",
    department: "Admin",
    designation: "CEO",
    ...overrides,
  });
}

export async function createInactiveSuperAdmin(overrides: Partial<typeof employees.$inferInsert> = {}) {
  return createTestEmployee({
    role: "super_admin",
    status: "inactive",
    department: "Admin",
    designation: "Past CEO",
    ...overrides,
  });
}

export async function createHrManager(overrides: Partial<typeof employees.$inferInsert> = {}) {
  return createTestEmployee({
    role: "hr_manager",
    status: "active",
    department: "HR",
    designation: "HR Manager",
    ...overrides,
  });
}

export async function createStandardEmployee(overrides: Partial<typeof employees.$inferInsert> = {}) {
  return createTestEmployee({
    role: "employee",
    status: "active",
    ...overrides,
  });
}

export async function createEmployeeWithManager(managerId: string, overrides: Partial<typeof employees.$inferInsert> = {}) {
  return createTestEmployee({
    role: "employee",
    status: "active",
    managerId,
    ...overrides,
  });
}
