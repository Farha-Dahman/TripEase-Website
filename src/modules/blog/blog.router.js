import { Router } from "express";
import * as blogController from "./blog.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./blog.endpoint.js";
import { asyncHandler } from "../../services/errorHandling.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
const router = Router();

router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).single("image"),
  asyncHandler(blogController.createBlog)
);
router.get(
  "/all",
  auth(endPoints.getAll),
  asyncHandler(blogController.getAllBlogs)
);
router.get(
  "/:blogId",
  auth(endPoints.specific),
  asyncHandler(blogController.getSpecificBlog)
);
router.put(
  "/:blogId",
  auth(endPoints.update),
  asyncHandler(blogController.updateBlog)
);
router.delete(
  "/:blogId",
  auth(endPoints.delete),
  asyncHandler(blogController.deleteBlog)
);

export default router;
