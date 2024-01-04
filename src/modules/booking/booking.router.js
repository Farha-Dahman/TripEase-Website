import { Router } from "express";
import * as bookingController from "./booking.controller.js";
import { endPoints } from "./booking.endpoint.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router();

router.post("/:packageId", auth(endPoints.add), bookingController.bookPackage);
router.get(
  "/:bookingId",
  auth(endPoints.specific),
  asyncHandler(bookingController.viewBookingDetails)
);
router.delete(
  "/:bookingId",
  auth(endPoints.cancel),
  asyncHandler(bookingController.cancelBooking)
);
router.get(
  "/:userId/history",
  auth(endPoints.getAll),
  asyncHandler(bookingController.viewBookingHistory)
);
router.put(
  "/confirmBooking/:token",
  asyncHandler(bookingController.confirmBooking)
);

export default router;
