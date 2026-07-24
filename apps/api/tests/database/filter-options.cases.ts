import { expect, test, describe, beforeEach } from "bun:test";
import { cleanTestDatabase } from "./setup";
import { EmployeeRepository } from "../../src/modules/employees/employee.repository";
import { createTestEmployee } from "./fixtures";

describe("Filter Options Query Tests", () => {
  const repo = new EmployeeRepository();

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  test("Returns empty arrays when table is empty", async () => {
    const options = await repo.getFilterOptions();
    expect(options).toEqual({ departments: [], designations: [] });
  });

  test("Retrieves unique, sorted, and excludes soft-deleted items", async () => {
    await createTestEmployee({ department: "Engineering", designation: "Backend", employeeCode: "E001" });
    await createTestEmployee({ department: "Engineering", designation: "Frontend", employeeCode: "E002" });
    await createTestEmployee({ department: "Sales", designation: "Manager", employeeCode: "E003" });
    
    // Duplicate values
    await createTestEmployee({ department: "Sales", designation: "Manager", employeeCode: "E004" });
    
    // Soft-deleted employee
    await createTestEmployee({ department: "HR", designation: "HR Analyst", deletedAt: new Date(), employeeCode: "E005" });

    const options = await repo.getFilterOptions();
    
    expect(options.departments).toEqual(["Engineering", "Sales"]); // HR excluded
    expect(options.designations).toEqual(["Backend", "Frontend", "Manager"]); // Analyst excluded
  });
});
