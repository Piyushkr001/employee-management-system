import { Request, Response, NextFunction } from "express";
import { EmployeeService } from "./employee.service";
import { sendResponse } from "../../utils/response";
import { EmployeeListQuery, EmployeeIdParams, CreateEmployeeInput, UpdateEmployeeInput, ManagerOptionsQuery } from "@empnexa/shared";
import { canListEmployees, canViewEmployee, canCreateEmployee, canUpdateEmployee, filterAllowedUpdateFields, canDeleteEmployee } from "./employee.authorization";
import { ApiError } from "../../utils/api-error";
import { AuthRepository } from "../auth/auth.repository";

export class EmployeeController {
  private service = new EmployeeService();

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = req.user!;
      if (!canListEmployees(actor)) {
        return next(new ApiError(403, "You do not have permission to view employees", "FORBIDDEN"));
      }

      const query = req.query as unknown as EmployeeListQuery;
      const data = await this.service.getPaginated(query, actor.role);

      sendResponse(res, 200, "Employees retrieved successfully", data);
    } catch (error) {
      next(error);
    }
  };

  managerOptions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = req.user!;
      if (!canListEmployees(actor)) {
        return next(new ApiError(403, "You do not have permission to view manager options", "FORBIDDEN"));
      }

      const query = req.query as unknown as ManagerOptionsQuery;
      
      const options = await this.service.getManagerOptions({
        search: query.search,
        excludeEmployeeId: query.excludeEmployeeId,
        limit: query.limit
      });

      sendResponse(res, 200, "Manager options retrieved successfully", { managers: options });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const actor = req.user!;
      const params = req.params as unknown as EmployeeIdParams;

      // Need target's basic identity info for authorization
      const authRepo = new AuthRepository();
      const target = await authRepo.findEmployeeIdentityById(params.id);

      if (!target || target.deletedAt) {
        return next(new ApiError(404, "Employee not found", "EMPLOYEE_NOT_FOUND"));
      }

      if (!canViewEmployee(actor, target as any)) {
        return next(new ApiError(403, "You do not have permission to view this employee", "FORBIDDEN"));
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
      const input = req.body as CreateEmployeeInput;

      if (!canCreateEmployee(actor, input)) {
        return next(new ApiError(403, "You do not have permission to create this employee", "FORBIDDEN"));
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
      const params = req.params as unknown as EmployeeIdParams;
      const input = req.body as UpdateEmployeeInput;

      const authRepo = new AuthRepository();
      const target = await authRepo.findEmployeeIdentityById(params.id);

      if (!target || target.deletedAt) {
        return next(new ApiError(404, "Employee not found", "EMPLOYEE_NOT_FOUND"));
      }

      if (!canUpdateEmployee(actor, target as any)) {
        return next(new ApiError(403, "You do not have permission to update this employee", "FORBIDDEN"));
      }

      const allowedInput = filterAllowedUpdateFields(actor, target as any, input);
      if (Object.keys(allowedInput).length === 0) {
        return next(new ApiError(400, "No allowed fields provided for update", "NO_FIELDS_UPDATED"));
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
      const params = req.params as unknown as EmployeeIdParams;

      const authRepo = new AuthRepository();
      const target = await authRepo.findEmployeeIdentityById(params.id);

      if (!target || target.deletedAt) {
        return next(new ApiError(404, "Employee not found", "EMPLOYEE_NOT_FOUND"));
      }

      if (!canDeleteEmployee(actor, target as any)) {
        return next(new ApiError(403, "You do not have permission to delete this employee", "FORBIDDEN"));
      }

      await this.service.softDelete(params.id);
      sendResponse(res, 200, "Employee deleted successfully");
    } catch (error) {
      next(error);
    }
  };
}
