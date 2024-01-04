import { Router } from "express";
import * as validators from "./user.validation.js";
import * as userController from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../services/errorHandling.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
import { endPoints } from "./user.endpoint.js";
const router = Router();

router.get(
  "/",
  fileUpload(fileValidation.image).single("image"),
  auth(endPoints.profile),
  validation(validators.profileVal),
  asyncHandler(userController.profile)
);
router.patch(
  "/cover",
  fileUpload(fileValidation.image).array("images", 5),
  auth(endPoints.profile),
  asyncHandler(userController.coverPicture)
);
router.patch(
  "/file",
  fileUpload(fileValidation.file).single("file"),
  auth(endPoints.addFile),
  asyncHandler(userController.addFile)
);
router.patch(
  "/changePassword",
  auth(endPoints.change),
  validation(validators.updatePassword),
  asyncHandler(userController.changePassword)
);
router.get(
  "/:id/profile",
  validation(validators.sharedProfile),
  asyncHandler(userController.sharedProfile)
);

export default router;
