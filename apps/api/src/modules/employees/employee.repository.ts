import db from "../../db";
import { employees } from "../../db/schema/employees";
import { eq, and, isNull, ne, or, ilike, desc, asc, count, sql } from "drizzle-orm";
import { EmployeeListQuery, UserRole } from "@empnexa/shared";
import { ApiError } from "../../utils/api-error";
import { EMPLOYEE_HIERARCHY_LOCK_KEY } from "./employee.constants";
import { assertAllowedUpdateFields } from "./employee.authorization";

type NewEmployee = typeof employees.$inferInsert;

export class EmployeeRepository {
  async findByEmail(email: string) {
    return db.query.employees.findFirst({
      where: and(eq(employees.email, email), isNull(employees.deletedAt)),
    });
  }

  async findByEmployeeCode(employeeCode: string) {
    return db.query.employees.findFirst({
      where: and(eq(employees.employeeCode, employeeCode), isNull(employees.deletedAt)),
    });
  }

  async findById(id: string) {
    return db.query.employees.findFirst({
      where: and(
        eq(employees.id, id),
        isNull(employees.deletedAt)
      ),
      columns: {
        passwordHash: false,
      },
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

  async findManagerIdentityById(id: string) {
    return db.query.employees.findFirst({
      columns: { id: true, managerId: true, status: true, deletedAt: true },
      where: and(eq(employees.id, id), isNull(employees.deletedAt)),
    });
  }

  async createEmployeeTransactionSafe(data: NewEmployee) {
    return await db.transaction(async (tx) => {
      if (data.managerId) {
        await tx.execute(sql`SELECT pg_advisory_xact_lock(${EMPLOYEE_HIERARCHY_LOCK_KEY})`);

        const [manager] = await tx
          .select({ id: employees.id, status: employees.status })
          .from(employees)
          .where(and(eq(employees.id, data.managerId), isNull(employees.deletedAt)))
          .for("update");

        if (!manager) {
          throw new ApiError(422, "Selected manager does not exist", "INVALID_MANAGER");
        }

        if (manager.status !== "active") {
          throw new ApiError(422, "Selected manager is inactive", "INVALID_MANAGER");
        }
      }

      const [employee] = await tx.insert(employees).values(data).returning();
      return employee;
    });
  }

  async updateEmployeeTransactionSafe(id: string, data: Partial<NewEmployee>, actor?: { id: string; role: UserRole }) {
    return await db.transaction(async (tx) => {
      // If managerId is being modified, acquire hierarchy lock
      if (data.managerId !== undefined) {
        await tx.execute(sql`SELECT pg_advisory_xact_lock(${EMPLOYEE_HIERARCHY_LOCK_KEY})`);
      }

      // Lock target employee
      const [targetEmployee] = await tx
        .select()
        .from(employees)
        .where(and(eq(employees.id, id), isNull(employees.deletedAt)))
        .for("update");

      if (!targetEmployee) {
        throw new ApiError(404, "Employee not found", "EMPLOYEE_NOT_FOUND");
      }

      if (actor) {
        // Assert authorization contextually with latest DB state
        assertAllowedUpdateFields(actor, targetEmployee as any, data as any);
        
        if (actor.role === "hr_manager" && targetEmployee.role === "super_admin") {
          throw new ApiError(403, "Cannot modify Super Admin", "CANNOT_MODIFY_SUPER_ADMIN");
        }
        
        if (actor.role === "employee" && actor.id !== targetEmployee.id) {
          throw new ApiError(403, "Cannot modify another employee", "FORBIDDEN");
        }
      }

      // Super Admin protection logic if role/status is changing
      const removesActiveSuperAdmin =
        targetEmployee.role === "super_admin" &&
        targetEmployee.status === "active" &&
        ((data.role !== undefined && data.role !== "super_admin") ||
         (data.status !== undefined && data.status !== "active"));

      if (removesActiveSuperAdmin) {
        const activeSuperAdmins = await tx
          .select({ id: employees.id })
          .from(employees)
          .where(
            and(
              eq(employees.role, "super_admin"),
              eq(employees.status, "active"),
              isNull(employees.deletedAt)
            )
          )
          .for("update");

        if (activeSuperAdmins.length <= 1 && activeSuperAdmins[0]?.id === id) {
          throw new ApiError(409, "Cannot demote or deactivate the last active Super Admin", "LAST_ACTIVE_SUPER_ADMIN");
        }
      }

      // Manager validation
      if (data.managerId) {
        if (data.managerId === id) {
          throw new ApiError(422, "Employee cannot manage themselves", "INVALID_MANAGER");
        }

        const [manager] = await tx
          .select({ id: employees.id, status: employees.status })
          .from(employees)
          .where(and(eq(employees.id, data.managerId), isNull(employees.deletedAt)))
          .for("update");

        if (!manager) {
          throw new ApiError(422, "Invalid manager ID", "INVALID_MANAGER");
        }

        if (manager.status !== "active") {
          throw new ApiError(422, "Manager must be active", "INVALID_MANAGER");
        }

        // Path-aware recursive CTE to check for circular reporting
        const cycleCheckQuery = sql`
          WITH RECURSIVE manager_chain AS (
            SELECT 
              id, 
              manager_id,
              ARRAY[id] AS path,
              false AS cycle_detected
            FROM employees
            WHERE id = ${data.managerId} AND deleted_at IS NULL
            
            UNION ALL
            
            SELECT 
              e.id, 
              e.manager_id,
              mc.path || e.id,
              e.id = ANY(mc.path)
            FROM employees e
            INNER JOIN manager_chain mc ON e.id = mc.manager_id
            WHERE e.deleted_at IS NULL AND mc.cycle_detected = false
          )
          SELECT id, cycle_detected FROM manager_chain WHERE id = ${id} OR cycle_detected = true;
        `;

        const cycleResult = await tx.execute(cycleCheckQuery);
        
        if (cycleResult.length > 0) {
          throw new ApiError(409, "Circular reporting structure detected", "CIRCULAR_REPORTING");
        }
      }

      // Apply update
      const [updatedEmployee] = await tx
        .update(employees)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(employees.id, id))
        .returning();

      return updatedEmployee;
    });
  }

  async softDelete(id: string) {
    return await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(${EMPLOYEE_HIERARCHY_LOCK_KEY})`);

      // Lock employee to delete
      const [targetEmployee] = await tx
        .select()
        .from(employees)
        .where(and(eq(employees.id, id), isNull(employees.deletedAt)))
        .for("update");

      if (!targetEmployee) {
        throw new ApiError(404, "Employee not found", "EMPLOYEE_NOT_FOUND");
      }

      // Check reportees
      const reportees = await tx
        .select({ id: employees.id })
        .from(employees)
        .where(
          and(
            eq(employees.managerId, id),
            isNull(employees.deletedAt)
          )
        )
        .for("update");

      if (reportees.length > 0) {
        throw new ApiError(409, "Reassign direct reportees before deleting this employee", "EMPLOYEE_HAS_REPORTEES");
      }

      const removesActiveSuperAdmin = 
        targetEmployee.role === "super_admin" && 
        targetEmployee.status === "active";

      if (removesActiveSuperAdmin) {
        const activeSuperAdmins = await tx
          .select({ id: employees.id })
          .from(employees)
          .where(
            and(
              eq(employees.role, "super_admin"),
              eq(employees.status, "active"),
              isNull(employees.deletedAt)
            )
          )
          .for("update");

        if (activeSuperAdmins.length <= 1 && activeSuperAdmins[0]?.id === id) {
          throw new ApiError(409, "Cannot remove the last active Super Admin", "LAST_ACTIVE_SUPER_ADMIN");
        }
      }

      const [deletedEmployee] = await tx
        .update(employees)
        .set({
          deletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(employees.id, id))
        .returning();

      return deletedEmployee;
    });
  }

  async getPaginated(query: EmployeeListQuery) {
    const { page, limit, search, department, designation, status, role, managerId, sortBy, sortOrder } = query;

    const filters = [isNull(employees.deletedAt)];

    if (search) {
      const searchCondition = or(
        ilike(employees.name, `%${search}%`),
        ilike(employees.email, `%${search}%`),
        ilike(employees.employeeCode, `%${search}%`),
        ilike(employees.phone, `%${search}%`)
      );

      if (searchCondition) {
        filters.push(searchCondition);
      }
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

    const employeeListSelection = {
      id: employees.id,
      employeeCode: employees.employeeCode,
      name: employees.name,
      email: employees.email,
      phone: employees.phone,
      department: employees.department,
      designation: employees.designation,
      salaryInPaise: employees.salaryInPaise,
      joiningDate: employees.joiningDate,
      status: employees.status,
      role: employees.role,
      managerId: employees.managerId,
      profileImageUrl: employees.profileImageUrl,
      createdAt: employees.createdAt,
      updatedAt: employees.updatedAt,
    };

    const totalCountResult = await db.select({ count: count() }).from(employees).where(whereClause);
    const total = totalCountResult[0].count;

    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
    const normalizedPage = Math.min(Math.max(page, 1), totalPages);
    const offset = (normalizedPage - 1) * limit;

    const data = await db.select(employeeListSelection).from(employees).where(whereClause).orderBy(orderByClause).limit(limit).offset(offset);

    return {
      employees: data,
      pagination: {
        page: normalizedPage,
        limit,
        total,
        totalPages,
        hasNextPage: normalizedPage < totalPages,
        hasPreviousPage: normalizedPage > 1,
      }
    };
  }

  async getManagerOptions(query: { search?: string; excludeEmployeeId?: string; limit?: number }) {
    const { search, excludeEmployeeId, limit = 100 } = query;
    const filters = [
      isNull(employees.deletedAt),
      eq(employees.status, "active")
    ];

    if (excludeEmployeeId) {
      filters.push(ne(employees.id, excludeEmployeeId));
    }

    if (search) {
      const searchCondition = or(
        ilike(employees.name, `%${search}%`),
        ilike(employees.employeeCode, `%${search}%`)
      );
      if (searchCondition) {
        filters.push(searchCondition);
      }
    }

    return await db.query.employees.findMany({
      where: and(...filters),
      limit,
      columns: {
        id: true,
        employeeCode: true,
        name: true,
        designation: true,
        department: true,
        status: true,
      },
      orderBy: [asc(employees.name)],
    });
  }
}
