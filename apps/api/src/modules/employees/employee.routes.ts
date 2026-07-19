import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";
import { validate } from "../../middleware/validate";
import { EmployeeController } from "./employee.controller";
import { USER_ROLES } from "@empnexa/shared";
import { employeeListQuerySchema, createEmployeeSchema, employeeIdParamsSchema, updateEmployeeSchema, managerOptionsQuerySchema } from "@empnexa/shared";

import { asyncHandler } from "../../utils/async-handler";

const router = Router();
const controller = new EmployeeController();

// All employee routes require authentication
router.use(authenticate);

router.get(
  "/",
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER),
  validate(employeeListQuerySchema, "query"),
  asyncHandler(controller.list.bind(controller))
);

router.post(
  "/",
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER),
  validate(createEmployeeSchema, "body"),
  asyncHandler(controller.create.bind(controller))
);

router.get(
  "/manager-options",
  authorize(USER_ROLES.SUPER_ADMIN, USER_ROLES.HR_MANAGER),
  validate(managerOptionsQuerySchema, "query"),
  asyncHandler(controller.managerOptions.bind(controller))
);

router.get(
  "/:id",
  validate(employeeIdParamsSchema, "params"),
  asyncHandler(controller.getById.bind(controller))
);

router.put(
  "/:id",
  validate(employeeIdParamsSchema, "params"),
  validate(updateEmployeeSchema, "body"),
  asyncHandler(controller.update.bind(controller))
);

router.delete(
  "/:id",
  authorize(USER_ROLES.SUPER_ADMIN),
  validate(employeeIdParamsSchema, "params"),
  asyncHandler(controller.softDelete.bind(controller))
);

export const employeeRoutes = router;
