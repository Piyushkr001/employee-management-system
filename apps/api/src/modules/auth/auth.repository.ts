import db from "../../db";
import { employees } from "../../db/schema/employees";
import { eq, and, isNull } from "drizzle-orm";

export class AuthRepository {
  async findEmployeeByEmail(email: string) {
    return db.query.employees.findFirst({
      where: and(
        eq(employees.email, email),
        isNull(employees.deletedAt)
      ),
    });
  }

  async findEmployeeById(id: string) {
    return db.query.employees.findFirst({
      where: and(
        eq(employees.id, id),
        isNull(employees.deletedAt)
      ),
    });
  }
}
