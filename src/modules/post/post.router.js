import { Router } from "express";
import * as postController from "./post.controller.js";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "./post.endpoint.js";
import { asyncHandler } from "../../services/errorHandling.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
const router = Router();

router.post(
  "/",
  auth(endPoints.create),
  fileUpload(fileValidation.image).single("image"),
  asyncHandler(postController.createPost)
);
router.get(
  "/",
  auth(endPoints.getAll),
  asyncHandler(postController.getAllPosts)
);
router.get(
  "/:postId",
  auth(endPoints.specific),
  asyncHandler(postController.getSpecificPost)
);
router.put(
  "/:postId",
  auth(endPoints.update),
  asyncHandler(postController.updatePost)
);
router.delete(
  "/:postId",
  auth(endPoints.delete),
  asyncHandler(postController.deletePost)
);

export default router;
