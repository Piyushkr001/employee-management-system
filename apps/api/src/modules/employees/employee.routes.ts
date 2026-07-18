import { Router } from "express";
import { authenticate } from "../../middleware/authenticate";
import { EmployeeController } from "./employee.controller";

const router = Router();
const controller = new EmployeeController();

// All employee routes require authentication
router.use(authenticate);

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.softDelete);

export const employeeRoutes = router;
