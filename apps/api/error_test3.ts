import { testDb } from "./tests/database/test-db";
import { EmployeeRepository } from "./src/modules/employees/employee.repository";
import { createActiveSuperAdmin, createTestEmployee } from "./tests/database/fixtures";

async function run() {
  const repo = new EmployeeRepository();
  const admin = await createActiveSuperAdmin();
  console.log("Admin inserted:", admin.id, admin.role, admin.status);
  
  const actor = { id: admin.id, role: admin.role };
  const manager = await createTestEmployee({ status: "active" });
  
  try {
    const emp = await repo.createEmployeeTransactionSafe({
      employeeCode: "EMP-OK",
      name: "Test",
      email: "ok@test.com",
      passwordHash: "hash",
      phone: "123",
      department: "Dept",
      designation: "Desig",
      salaryInPaise: 1000,
      joiningDate: "2026-01-01",
      status: "active",
      role: "employee",
      managerId: manager.id
    } as any, actor);
    console.log("Success:", emp.id);
  } catch (err: any) {
    console.error("Failed:", err);
  }
  process.exit(0);
}
run();
