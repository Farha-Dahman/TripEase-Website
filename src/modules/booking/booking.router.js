import { Router } from "express";
import * as bookingController from "./booking.controller.js";
import { endPoints } from "./booking.endpoint.js";
import { auth } from "../../middleware/auth.js";
const router = Router();

router.post("/:packageId", auth(endPoints.add), bookingController.bookPackage);
router.get(
  "/:bookingId",
  auth(endPoints.specific),
  bookingController.viewBookingDetails
);
router.delete(
  "/:bookingId",
  auth(endPoints.cancel),
  bookingController.cancelBooking
);

export default router;
