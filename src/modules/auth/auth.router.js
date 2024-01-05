import { Router } from "express";
import * as AuthController from "../auth/auth.controller.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
const router = Router();

router.post(
  "/signup",
  validation(signupSchema),
  asyncHandler(AuthController.signup)
);
router.post(
  "/login",
  validation(loginSchema),
  asyncHandler(AuthController.login)
);
router.put("/confirmEmail/:token", asyncHandler(AuthController.confirmEmail));
router.patch("/sendCode", asyncHandler(AuthController.sendCode));
router.patch("/forgetPassword", asyncHandler(AuthController.forgetPassword));

export default router;
