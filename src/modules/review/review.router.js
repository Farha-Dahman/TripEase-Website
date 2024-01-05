import { Router } from "express";
import * as reviewController from "./review.controller.js";
import { asyncHandler } from "../../services/errorHandling.js";
import { endPoints } from "./review.endpoint.js";
import { auth } from "../../middleware/auth.js";
const router = Router();

router.post(
  "/:tourPackageId",
  auth(endPoints.create),
  asyncHandler(reviewController.createReview)
);
router.get(
  "/",
  auth(endPoints.getAll),
  asyncHandler(reviewController.getAllReviews)
);
router.get(
  "/:tourPackageId/allRev",
  auth(endPoints.specific),
  asyncHandler(reviewController.getReviewsForTourPackage)
);
router.get(
  "/:reviewId",
  auth(endPoints.specific),
  asyncHandler(reviewController.getSpecificReview)
);
router.put(
  "/:reviewId",
  auth(endPoints.update),
  asyncHandler(reviewController.updateReview)
);
router.delete(
  "/:reviewId",
  auth(endPoints.delete),
  asyncHandler(reviewController.deleteReview)
);

export default router;
