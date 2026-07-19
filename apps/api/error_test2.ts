import { testDb } from "./tests/database/test-db";
import { employees } from "./src/db/schema";
import { hashPassword } from "./src/utils/password";
import { unwrapPostgreSqlError } from "./src/utils/database-error";

async function run() {
  try {
    const pw = await hashPassword("pass");
    const emp = {
      employeeCode: "TESTERR2",
      name: "Test",
      email: "testerr2@empnexa.com",
      passwordHash: pw,
      phone: "123",
      department: "D",
      designation: "D",
      salaryInPaise: 100,
      joiningDate: "2026-01-01",
      status: "active" as any,
      role: "employee" as any
    };
    await testDb.insert(employees).values(emp);
    await testDb.insert(employees).values(emp); // Duplicate email
  } catch (err: any) {
    const pg = unwrapPostgreSqlError(err);
    console.log("unwrap:", pg);
  }
  process.exit(0);
}
run();
