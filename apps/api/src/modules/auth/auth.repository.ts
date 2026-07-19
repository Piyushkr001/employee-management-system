import db from "../../db";
import { employees } from "../../db/schema/employees";
import { eq, and, isNull } from "drizzle-orm";

export class AuthRepository {
  async findEmployeeForLoginByEmail(email: string) {
    return db.query.employees.findFirst({
      where: and(
        eq(employees.email, email),
        isNull(employees.deletedAt)
      ),
      columns: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        passwordHash: true,
        phone: true,
        department: true,
        designation: true,
        joiningDate: true,
        status: true,
        role: true,
        managerId: true,
        profileImageUrl: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        // specifically excluding salaryInPaise
      }
    });
  }

  async findEmployeeIdentityById(id: string) {
    return db.query.employees.findFirst({
      where: and(
        eq(employees.id, id),
        isNull(employees.deletedAt)
      ),
      columns: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        role: true,
        status: true,
        deletedAt: true,
      }
    });
  }

  async findFullEmployeeById(id: string) {
    return db.query.employees.findFirst({
      where: and(
        eq(employees.id, id),
        isNull(employees.deletedAt)
      ),
      columns: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        phone: true,
        department: true,
        designation: true,
        joiningDate: true,
        status: true,
        role: true,
        managerId: true,
        profileImageUrl: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      }
    });
  }
}
