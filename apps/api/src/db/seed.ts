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
    const superAdminData = {
      employeeCode: "EMP101",
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
    };
    const superAdminRes = await db.insert(employees).values(superAdminData).onConflictDoUpdate({ 
      target: employees.email, 
      set: { ...superAdminData, employeeCode: undefined, updatedAt: new Date() } 
    }).returning({ id: employees.id });
    const superAdminId = superAdminRes[0].id;

    // 2. Create middle managers
    const hrManagerData = {
      employeeCode: "EMP102",
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
      managerId: superAdminId,
    };
    const hrManagerRes = await db.insert(employees).values(hrManagerData).onConflictDoUpdate({ 
      target: employees.email, 
      set: { ...hrManagerData, employeeCode: undefined, updatedAt: new Date() } 
    }).returning({ id: employees.id });
    const hrManagerId = hrManagerRes[0].id;

    const engLeadData = {
      employeeCode: "EMP103",
      name: "Engineering Lead",
      email: "englead@empnexa.com",
      passwordHash: empPassword,
      phone: "+1234567892",
      department: "Engineering",
      designation: "Engineering Lead",
      salaryInPaise: 12000000, 
      joiningDate: "2026-01-20",
      status: "active" as const,
      role: "employee" as const,
      managerId: superAdminId,
    };
    const engLeadRes = await db.insert(employees).values(engLeadData).onConflictDoUpdate({ 
      target: employees.email, 
      set: { ...engLeadData, employeeCode: undefined, updatedAt: new Date() } 
    }).returning({ id: employees.id });
    const engLeadId = engLeadRes[0].id;

    const prodManagerData = {
      employeeCode: "EMP104",
      name: "Product Manager",
      email: "pm@empnexa.com",
      passwordHash: empPassword,
      phone: "+1234567893",
      department: "Product",
      designation: "Product Manager",
      salaryInPaise: 11000000, 
      joiningDate: "2026-01-25",
      status: "active" as const,
      role: "employee" as const,
      managerId: superAdminId,
    };
    const prodManagerRes = await db.insert(employees).values(prodManagerData).onConflictDoUpdate({ 
      target: employees.email, 
      set: { ...prodManagerData, employeeCode: undefined, updatedAt: new Date() } 
    }).returning({ id: employees.id });
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
      const empData = {
        employeeCode: emp.employeeCode,
        name: emp.name,
        email: emp.email,
        passwordHash: defaultPassword,
        phone: "+1000000000",
        department: emp.department,
        designation: emp.designation,
        salaryInPaise: 6000000,
        joiningDate: "2026-03-01",
        status: "active" as const,
        role: emp.role,
        managerId: emp.managerId,
      };
      await db.insert(employees).values(empData).onConflictDoUpdate({
        target: employees.email,
        set: { ...empData, employeeCode: undefined, updatedAt: new Date() }
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
