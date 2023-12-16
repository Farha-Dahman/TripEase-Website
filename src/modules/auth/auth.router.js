import { Router } from "express";
import * as AuthController from "../auth/auth.controller.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router();

router.post(
  "/signup",
  fileUpload(fileValidation.image).single("image"),
  asyncHandler(AuthController.signup)
);
router.post("/login", asyncHandler(AuthController.login));
router.put("/confirmEmail/:token", asyncHandler(AuthController.confirmEmail));
router.patch("/sendCode", asyncHandler(AuthController.sendCode));
router.patch("/forgetPassword", asyncHandler(AuthController.forgetPassword));

export default router;
