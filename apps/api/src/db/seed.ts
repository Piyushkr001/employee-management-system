import { db, client } from "./index";
import { employees } from "./schema/employees";
import { hashPassword } from "@/utils/password";

async function seed() {
  console.log("🌱 Starting database seeding...");

  try {
    const adminPassword = await hashPassword("Admin@123");
    const hrPassword = await hashPassword("HrManager@123");
    const empPassword = await hashPassword("Employee@123");

    // 1. Create top level (Super Admin)
    const superAdminRes = await db.insert(employees).values({
      employeeCode: "EMP101",
      name: "Super Admin",
      email: "admin@empnexa.com",
      passwordHash: adminPassword,
      phone: "+1234567890",
      department: "Administration",
      designation: "Chief Executive",
      salaryInPaise: 15000000, 
      joiningDate: "2026-01-01",
      status: "active",
      role: "super_admin",
    }).onConflictDoUpdate({ target: employees.email, set: { name: "Super Admin" } }).returning({ id: employees.id });
    const superAdminId = superAdminRes[0].id;

    // 2. Create middle managers
    const hrManagerRes = await db.insert(employees).values({
      employeeCode: "EMP102",
      name: "HR Manager",
      email: "hr@empnexa.com",
      passwordHash: hrPassword,
      phone: "+1234567891",
      department: "Human Resources",
      designation: "HR Director",
      salaryInPaise: 10000000, 
      joiningDate: "2026-01-15",
      status: "active",
      role: "hr_manager",
      managerId: superAdminId,
    }).onConflictDoUpdate({ target: employees.email, set: { managerId: superAdminId } }).returning({ id: employees.id });
    const hrManagerId = hrManagerRes[0].id;

    const engLeadRes = await db.insert(employees).values({
      employeeCode: "EMP103",
      name: "Engineering Lead",
      email: "englead@empnexa.com",
      passwordHash: empPassword,
      phone: "+1234567892",
      department: "Engineering",
      designation: "Engineering Lead",
      salaryInPaise: 12000000, 
      joiningDate: "2026-01-20",
      status: "active",
      role: "employee",
      managerId: superAdminId,
    }).onConflictDoUpdate({ target: employees.email, set: { managerId: superAdminId } }).returning({ id: employees.id });
    const engLeadId = engLeadRes[0].id;

    const prodManagerRes = await db.insert(employees).values({
      employeeCode: "EMP104",
      name: "Product Manager",
      email: "pm@empnexa.com",
      passwordHash: empPassword,
      phone: "+1234567893",
      department: "Product",
      designation: "Product Manager",
      salaryInPaise: 11000000, 
      joiningDate: "2026-01-25",
      status: "active",
      role: "employee",
      managerId: superAdminId,
    }).onConflictDoUpdate({ target: employees.email, set: { managerId: superAdminId } }).returning({ id: employees.id });
    const prodManagerId = prodManagerRes[0].id;

    const defaultPassword = await hashPassword("Welcome@123");

    // 3. Create reportees
    const reportees = [
      { employeeCode: "EMP105", name: "HR Executive", email: "hrexec@empnexa.com", department: "Human Resources", designation: "HR Executive", role: "employee" as const, managerId: hrManagerId },
      { employeeCode: "EMP106", name: "Recruiter", email: "recruiter@empnexa.com", department: "Human Resources", designation: "Recruiter", role: "employee" as const, managerId: hrManagerId },
      { employeeCode: "EMP107", name: "Frontend Developer", email: "frontend@empnexa.com", department: "Engineering", designation: "Frontend Developer", role: "employee" as const, managerId: engLeadId },
      { employeeCode: "EMP108", name: "Backend Developer", email: "backend@empnexa.com", department: "Engineering", designation: "Backend Developer", role: "employee" as const, managerId: engLeadId },
      { employeeCode: "EMP109", name: "Product Designer", email: "designer@empnexa.com", department: "Product", designation: "Product Designer", role: "employee" as const, managerId: prodManagerId },
      { employeeCode: "EMP110", name: "Business Analyst", email: "ba@empnexa.com", department: "Product", designation: "Business Analyst", role: "employee" as const, managerId: prodManagerId },
    ];

    console.log("Seeding reportees...");
    for (const emp of reportees) {
      await db.insert(employees).values({
        employeeCode: emp.employeeCode,
        name: emp.name,
        email: emp.email,
        passwordHash: defaultPassword,
        phone: "+1000000000",
        department: emp.department,
        designation: emp.designation,
        salaryInPaise: 6000000,
        joiningDate: "2026-03-01",
        status: "active",
        role: emp.role,
        managerId: emp.managerId,
      }).onConflictDoUpdate({
        target: employees.email,
        set: { managerId: emp.managerId }
      });
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
