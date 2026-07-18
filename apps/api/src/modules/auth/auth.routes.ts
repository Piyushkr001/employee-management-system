import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middleware/validate";
import { loginSchema } from "@empnexa/shared";
import { asyncHandler } from "../../utils/async-handler";
import { authenticate } from "../../middleware/authenticate";

const router = Router();
const controller = new AuthController();

router.post("/login", validate(loginSchema, "body"), asyncHandler(controller.login));
router.post("/logout", asyncHandler(controller.logout));
router.get("/me", asyncHandler(authenticate), asyncHandler(controller.getCurrentUser));

export default router;
