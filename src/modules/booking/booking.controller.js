import jwt from "jsonwebtoken";
import bookingModel from "../../db/model/booking.model.js";
import tourPackageModel from "../../db/model/tourPackage.model.js";
import { sendEmail } from "../../services/email.js";

export const bookPackage = async (req, res, next) => {
  try {
    const { packageId } = req.params;
    const { numberOfPeople } = req.body;
    const userId = req.user._id;
    const email = req.user.email;
    const tourPackage = await tourPackageModel.findById(packageId);

    if (!tourPackage) {
      return res.status(404).json({ error: "Package not found" });
    }

    const token = jwt.sign(
      { userId, packageId },
      process.env.CONFIRM_BOOKING_SECRET,
      { expiresIn: "1h" }
    );

    const newBooking = new bookingModel({
      date: new Date(),
      numberOfPeople,
      status: "Pending",
      user: userId,
      tourPackage: packageId,
    });

    sendEmail(
      email,
      "Confirm Your Booking",
      `Click here to <a href='${req.protocol}://${req.headers.host}/booking/confirmBooking/${token}'>Verify Booking</a>`
    );

    const savedBooking = await newBooking.save();
    return res.status(200).json({ message: "success", savedBooking });
  } catch (error) {
    return next(new Error("Internal Server Error", { cause: 500 }));
  }
};

export const viewBookingDetails = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const bookingDetails = await bookingModel.findById(bookingId);

    if (!bookingDetails) {
      return next(new Error("Booking not found", { cause: 404 }));
    }

    if (!bookingDetails.confirmBooking) {
      return next(new Error("Booking is not confirmed", { cause: 403 }));
    }

    if (bookingDetails.user.toString() !== req.user.id) {
      return next(new Error("Unauthorized", { cause: 403 }));
    }
    return res.status(200).json({ message: "success", bookingDetails });
  } catch (error) {
    return next(new Error("Internal Server Error", { cause: 500 }));
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await bookingModel.findById(bookingId);
    if (!booking) {
      return next(new Error("Booking not found", { cause: 404 }));
    }

    if (booking.user.toString() !== req.user.id) {
      return next(new Error("Unauthorized", { cause: 403 }));
    }

    booking.status = "Canceled";
    const updatedBooking = await booking.save();
    return res.status(200).json({ message: "success", updatedBooking });
  } catch (error) {
    return next(new Error("Internal Server Error", { cause: 500 }));
  }
};

export const viewBookingHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const bookingHistory = await bookingModel.find({ user: userId });

    return res.status(200).json({ message: "success", bookingHistory });
  } catch (error) {
    return next(new Error("Internal Server Error", { cause: 500 }));
  }
};

export const confirmBooking = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decodedToken = jwt.verify(token, process.env.CONFIRM_BOOKING_SECRET);
    const { userId, packageId } = decodedToken;
    const updatedBooking = await bookingModel.findOneAndUpdate(
      { user: userId, tourPackage: packageId, confirmBooking: false },
      { confirmBooking: true },
      { new: true }
    );

    if (!updatedBooking) {
      return next(
        new Error("Invalid booking confirmation or booking already confirmed", {
          cause: 400,
        })
      );
    }

    return res.status(200).json({ message: "Booking confirmed successfully" });
  } catch (error) {
    return next(new Error("Invalid token", { cause: 404 }));
  }
};
