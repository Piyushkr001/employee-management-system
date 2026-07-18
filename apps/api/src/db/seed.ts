import { db, client } from "./index";
import { employees } from "./schema/employees";
import { hashPassword } from "@/utils/password";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    const adminPassword = await hashPassword("Admin@123");
    const hrPassword = await hashPassword("HrManager@123");
    const empPassword = await hashPassword("Employee@123");

    const demoUsers = [
      {
        employeeCode: "EMP001",
        name: "Super Admin",
        email: "admin@empnexa.com",
        passwordHash: adminPassword,
        phone: "+1234567890",
        department: "Administration",
        designation: "Chief Executive",
        salaryInPaise: 15000000, 
        joiningDate: "2026-01-01",
        status: "active" as const,
        role: "super_admin" as const,
      },
      {
        employeeCode: "EMP002",
        name: "HR Manager",
        email: "hr@empnexa.com",
        passwordHash: hrPassword,
        phone: "+1234567891",
        department: "Human Resources",
        designation: "HR Director",
        salaryInPaise: 10000000, 
        joiningDate: "2026-01-15",
        status: "active" as const,
        role: "hr_manager" as const,
      },
      {
        employeeCode: "EMP003",
        name: "Employee",
        email: "employee@empnexa.com",
        passwordHash: empPassword,
        phone: "+1234567892",
        department: "Engineering",
        designation: "Software Engineer",
        salaryInPaise: 8000000,
        joiningDate: "2026-02-01",
        status: "active" as const,
        role: "employee" as const,
      },
    ];

    const defaultPassword = await hashPassword("Welcome@123");

    const additionalEmployees = [
      { employeeCode: "EMP004", name: "Alice Smith", email: "alice@empnexa.com", department: "Engineering", role: "employee" as const },
      { employeeCode: "EMP005", name: "Bob Jones", email: "bob@empnexa.com", department: "Product", role: "employee" as const },
      { employeeCode: "EMP006", name: "Charlie Brown", email: "charlie@empnexa.com", department: "Design", role: "employee" as const },
      { employeeCode: "EMP007", name: "Diana Prince", email: "diana@empnexa.com", department: "Sales", role: "employee" as const },
      { employeeCode: "EMP008", name: "Evan Wright", email: "evan@empnexa.com", department: "Finance", role: "employee" as const },
      { employeeCode: "EMP009", name: "Fiona Gallagher", email: "fiona@empnexa.com", department: "Operations", role: "employee" as const },
      { employeeCode: "EMP010", name: "George Miller", email: "george@empnexa.com", department: "Engineering", role: "employee" as const },
      { employeeCode: "EMP011", name: "Hannah Lee", email: "hannah@empnexa.com", department: "Human Resources", role: "employee" as const },
    ];

    // Seed Demo Users
    console.log("Seeding core demo accounts...");
    for (const user of demoUsers) {
      await db.insert(employees).values(user).onConflictDoUpdate({
        target: employees.email,
        set: { ...user, updatedAt: new Date() }
      });
    }

    // Seed Additional Employees
    console.log("Seeding additional realistic employees...");
    for (const emp of additionalEmployees) {
      await db.insert(employees).values({
        employeeCode: emp.employeeCode,
        name: emp.name,
        email: emp.email,
        passwordHash: defaultPassword,
        phone: "+1000000000",
        department: emp.department,
        designation: "Staff",
        salaryInPaise: 6000000,
        joiningDate: "2026-03-01",
        status: "active",
        role: emp.role,
      }).onConflictDoNothing({ target: employees.email });
    }

    console.log("✅ Database seeding completed successfully.");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

seed();
