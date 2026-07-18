import { db } from "./index";
import { employees } from "./schema/employees";
import { hashPassword } from "@/utils/password";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    const adminPassword = await hashPassword("Admin@123");
    const hrPassword = await hashPassword("HrManager@123");
    const empPassword = await hashPassword("Employee@123");
    
    // Using upsert (ON CONFLICT DO NOTHING / UPDATE) isn't strictly necessary if we rely on onConflictDoUpdate
    // but onConflictDoUpdate requires specifying a conflict target.
    // Drizzle currently supports onConflictDoUpdate. We will use email as conflict target.

    const demoUsers = [
      {
        employeeCode: "EMP001",
        name: "Super Admin",
        email: "admin@empnexa.com",
        passwordHash: adminPassword,
        phone: "+1234567890",
        department: "Administration",
        designation: "Chief Executive",
        salary: 15000000, // 150k USD in cents
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
        salary: 10000000, 
        joiningDate: "2026-01-15",
        status: "active" as const,
        role: "hr_manager" as const,
      },
      {
        employeeCode: "EMP003",
        name: "Demo Employee",
        email: "employee@empnexa.com",
        passwordHash: empPassword,
        phone: "+1234567892",
        department: "Engineering",
        designation: "Software Engineer",
        salary: 8000000,
        joiningDate: "2026-02-01",
        status: "active" as const,
        role: "employee" as const,
      },
    ];

    const additionalEmployees = [
      { code: "EMP004", name: "Alice Smith", email: "alice@empnexa.com", dept: "Engineering", role: "employee" },
      { code: "EMP005", name: "Bob Jones", email: "bob@empnexa.com", dept: "Product", role: "employee" },
      { code: "EMP006", name: "Charlie Brown", email: "charlie@empnexa.com", dept: "Design", role: "employee" },
      { code: "EMP007", name: "Diana Prince", email: "diana@empnexa.com", dept: "Sales", role: "employee" },
      { code: "EMP008", name: "Evan Wright", email: "evan@empnexa.com", dept: "Finance", role: "employee" },
      { code: "EMP009", name: "Fiona Gallagher", email: "fiona@empnexa.com", dept: "Operations", role: "employee" },
      { code: "EMP010", name: "George Miller", email: "george@empnexa.com", dept: "Engineering", role: "employee" },
      { code: "EMP011", name: "Hannah Lee", email: "hannah@empnexa.com", dept: "Marketing", role: "employee" },
    ];

    // Seed Demo Users
    console.log("Seeding core demo accounts...");
    for (const user of demoUsers) {
      await db.insert(employees).values(user).onConflictDoUpdate({
        target: employees.email,
        set: { ...user, updatedAt: new Date() }
      });
    }

    const defaultPassword = await hashPassword("Welcome@123");

    // Seed Additional Employees
    console.log("Seeding additional realistic employees...");
    for (const emp of additionalEmployees) {
      await db.insert(employees).values({
        employeeCode: emp.code,
        name: emp.name,
        email: emp.email,
        passwordHash: defaultPassword,
        phone: "+1000000000",
        department: emp.dept,
        designation: "Staff",
        salary: 6000000,
        joiningDate: "2026-03-01",
        status: "active",
        role: emp.role as any,
      }).onConflictDoNothing({ target: employees.email });
    }

    // Attempt to set manager relationship (Bob reports to Alice, for example)
    // First, find Alice
    const alice = await db.query.employees.findFirst({ where: (emps, { eq }) => eq(emps.email, "alice@empnexa.com") });
    if (alice) {
      const { inArray } = await import("drizzle-orm");
      await db.update(employees)
        .set({ managerId: alice.id, updatedAt: new Date() })
        .where(inArray(employees.email, ["bob@empnexa.com", "george@empnexa.com"]));
    }

    console.log("✅ Database seeding completed successfully.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
