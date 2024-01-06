import { Router } from "express";
import * as commentController from "./comment.controller.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { auth } from "../../middleware/auth.js";
import { endPoints } from "../post/post.endpoint.js";

const router = Router();

router.post(
  "/:postId",
  auth(endPoints.create),
  asyncHandler(commentController.addComment)
);
router.get(
  "/:postId",
  auth(endPoints.getAll),
  asyncHandler(commentController.getCommentsForPost)
);
router.put(
  "/:commentId",
  auth(endPoints.update),
  asyncHandler(commentController.updateComment)
);
router.delete(
  "/:commentId",
  auth(endPoints.delete),
  asyncHandler(commentController.deleteComment)
);

export default router;
