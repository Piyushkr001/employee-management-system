import db from "../../db";
import { employees } from "../../db/schema/employees";
import { eq, and, isNull, ne, or, ilike, desc, asc, count } from "drizzle-orm";
import { EmployeeListQuery } from "@empnexa/shared";

type NewEmployee = typeof employees.$inferInsert;

export class EmployeeRepository {
  async findByEmail(email: string) {
    return db.query.employees.findFirst({
      where: eq(employees.email, email),
    });
  }

  async findByEmployeeCode(employeeCode: string) {
    return db.query.employees.findFirst({
      where: eq(employees.employeeCode, employeeCode),
    });
  }

  async findById(id: string) {
    return db.query.employees.findFirst({
      where: and(
        eq(employees.id, id),
        isNull(employees.deletedAt)
      ),
      with: {
        manager: {
          columns: {
            id: true,
            employeeCode: true,
            name: true,
            designation: true,
          }
        }
      }
    });
  }

  async countReportees(id: string) {
    const result = await db
      .select({ count: count() })
      .from(employees)
      .where(
        and(
          eq(employees.managerId, id),
          isNull(employees.deletedAt)
        )
      );
    return result[0].count;
  }

  async countActiveSuperAdmins() {
    const result = await db
      .select({ count: count() })
      .from(employees)
      .where(
        and(
          eq(employees.role, "super_admin"),
          eq(employees.status, "active"),
          isNull(employees.deletedAt)
        )
      );
    return result[0].count;
  }

  async create(data: NewEmployee) {
    const [employee] = await db.insert(employees).values(data).returning();
    return employee;
  }

  async update(id: string, data: Partial<NewEmployee>) {
    const [employee] = await db
      .update(employees)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return employee;
  }

  async softDelete(id: string) {
    const [employee] = await db
      .update(employees)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(employees.id, id))
      .returning();
    return employee;
  }

  async getPaginated(query: EmployeeListQuery) {
    const { page, limit, search, department, designation, status, role, managerId, sortBy, sortOrder } = query;
    const offset = (page - 1) * limit;

    const filters = [isNull(employees.deletedAt)];

    if (search) {
      filters.push(
        or(
          ilike(employees.name, `%${search}%`),
          ilike(employees.email, `%${search}%`),
          ilike(employees.employeeCode, `%${search}%`),
          ilike(employees.phone, `%${search}%`)
        )
      );
    }
    if (department) filters.push(eq(employees.department, department));
    if (designation) filters.push(eq(employees.designation, designation));
    if (status) filters.push(eq(employees.status, status as any));
    if (role) filters.push(eq(employees.role, role as any));
    if (managerId) filters.push(eq(employees.managerId, managerId));

    const whereClause = and(...filters);

    let orderByClause;
    const orderFn = sortOrder === "desc" ? desc : asc;

    switch (sortBy) {
      case "name": orderByClause = orderFn(employees.name); break;
      case "employeeCode": orderByClause = orderFn(employees.employeeCode); break;
      case "email": orderByClause = orderFn(employees.email); break;
      case "department": orderByClause = orderFn(employees.department); break;
      case "designation": orderByClause = orderFn(employees.designation); break;
      case "joiningDate": orderByClause = orderFn(employees.joiningDate); break;
      default: orderByClause = orderFn(employees.createdAt); break;
    }

    const [data, totalCountResult] = await Promise.all([
      db.select().from(employees).where(whereClause).orderBy(orderByClause).limit(limit).offset(offset),
      db.select({ count: count() }).from(employees).where(whereClause)
    ]);

    const total = totalCountResult[0].count;
    const totalPages = Math.ceil(total / limit);

    return {
      employees: data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      }
    };
  }
}
