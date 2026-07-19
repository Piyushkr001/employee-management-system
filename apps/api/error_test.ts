import { testDb } from "./tests/database/test-db";
import { employees } from "./src/db/schema";
import { hashPassword } from "./src/utils/password";

async function run() {
  try {
    await testDb.insert(employees).values({
      employeeCode: "TESTERR",
      name: "Test",
      email: "testerr@empnexa.com",
      passwordHash: await hashPassword("pass"),
      phone: "123",
      department: "D",
      designation: "D",
      salaryInPaise: -100, // Should fail constraint
      joiningDate: "2026-01-01",
      status: "active",
      role: "employee"
    });
  } catch (err: any) {
    console.log("KEYS:", Object.keys(err));
    console.log("NAME:", err.name);
    console.log("CODE:", err.code);
    console.log("CONSTRAINT:", err.constraint_name);
    console.log("CAUSE:", err.cause);
    console.log(err);
  }
  process.exit(0);
}
run();
