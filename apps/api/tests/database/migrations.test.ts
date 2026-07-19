import { expect, test, describe, beforeAll, afterAll } from "bun:test";
import { setupTestDatabase, closeTestDatabase } from "./setup";
import { testDb } from "./test-db";
import { sql } from "drizzle-orm";

describe("Database Migrations", () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await closeTestDatabase();
  });

  test("Employee table constraints should exist", async () => {
    // Verify table exists
    const tableRes = await testDb.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'employees'
      );
    `);
    expect(tableRes[0].exists).toBe(true);

    // Verify enums exist
    const enumRes = await testDb.execute(sql`
      SELECT typname FROM pg_type WHERE typname IN ('employee_role', 'employee_status');
    `);
    const enums = enumRes.map((r: any) => r.typname);
    expect(enums).toContain("employee_role");
    expect(enums).toContain("employee_status");

    // Verify constraints
    const constraintsRes = await testDb.execute(sql`
      SELECT conname FROM pg_constraint 
      JOIN pg_class ON pg_constraint.conrelid = pg_class.oid 
      WHERE pg_class.relname = 'employees';
    `);
    const constraintNames = constraintsRes.map((r: any) => r.conname);
    
    // Check constraints: salary >= 0, self-manager exclusion
    expect(constraintNames).toContain("employees_salary_non_negative");
    expect(constraintNames).toContain("employees_manager_not_self");
    // Drizzle names constraints like `employees_salary_in_paise_check` by default or similar
    expect(constraintNames.some((c: any) => c.includes("manager_id_fkey"))).toBe(true);
    expect(constraintNames.some((c: any) => c.includes("check"))).toBe(true); // salary check, self-manager check
  });
});
