import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "./employee.service";
import { sendResponse } from "../../utils/response";
import { employeeListQuerySchema, employeeIdParamsSchema, createEmployeeSchema, updateEmployeeSchema } from "@empnexa/shared";
import { canListEmployees, canViewEmployee, canCreateEmployee, canUpdateEmployee, filterAllowedUpdateFields, canDeleteEmployee } from "./employee.authorization";
import { ApiError } from "../../utils/api-error";
import { AuthRepository } from "../auth/auth.repository";

export class EmployeeController {
  private service = new EmployeeService();

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = req.user!;
      if (!canListEmployees(actor)) {
        return next(new ApiError(403, "You do not have permission to view employees"));
      }

      const query = employeeListQuerySchema.parse(req.query);
      const data = await this.service.getPaginated(query, actor.role);

      sendResponse(res, 200, "Employees retrieved successfully", data);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = req.user!;
      const params = employeeIdParamsSchema.parse(req.params);

      // Need target's basic identity info for authorization
      const authRepo = new AuthRepository();
      const target = await authRepo.findEmployeeIdentityById(params.id);

      if (!target || target.deletedAt) {
        return next(new ApiError(404, "Employee not found"));
      }

      if (!canViewEmployee(actor, target as any)) {
        return next(new ApiError(403, "You do not have permission to view this employee"));
      }

      const employee = await this.service.getById(params.id, actor.role);
      sendResponse(res, 200, "Employee retrieved successfully", employee);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = req.user!;
      const input = createEmployeeSchema.parse(req.body);

      if (!canCreateEmployee(actor, input)) {
        return next(new ApiError(403, "You do not have permission to create this employee"));
      }

      const employee = await this.service.create(input);
      sendResponse(res, 201, "Employee created successfully", employee);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = req.user!;
      const params = employeeIdParamsSchema.parse(req.params);
      const input = updateEmployeeSchema.parse(req.body);

      const authRepo = new AuthRepository();
      const target = await authRepo.findEmployeeIdentityById(params.id);

      if (!target || target.deletedAt) {
        return next(new ApiError(404, "Employee not found"));
      }

      if (!canUpdateEmployee(actor, target as any)) {
        return next(new ApiError(403, "You do not have permission to update this employee"));
      }

      const allowedInput = filterAllowedUpdateFields(actor, target as any, input);
      if (Object.keys(allowedInput).length === 0) {
        return next(new ApiError(400, "No allowed fields provided for update"));
      }

      const employee = await this.service.update(params.id, allowedInput, actor.role);
      sendResponse(res, 200, "Employee updated successfully", employee);
    } catch (error) {
      next(error);
    }
  };

  softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = req.user!;
      const params = employeeIdParamsSchema.parse(req.params);

      const authRepo = new AuthRepository();
      const target = await authRepo.findEmployeeIdentityById(params.id);

      if (!target || target.deletedAt) {
        return next(new ApiError(404, "Employee not found"));
      }

      if (!canDeleteEmployee(actor, target as any)) {
        return next(new ApiError(403, "You do not have permission to delete this employee"));
      }

      await this.service.softDelete(params.id);
      sendResponse(res, 200, "Employee deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
