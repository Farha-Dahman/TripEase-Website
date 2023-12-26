import bookingModel from "../../db/model/booking.model.js";
import tourPackageModel from "../../db/model/tourPackage.model.js";

export const bookPackage = async (req, res, next) => {
  try {
    const { packageId } = req.params;
    const { numberOfPeople } = req.body;
    const userId = req.user._id;
    const tourPackage = await tourPackageModel.findById(packageId);
    if (!tourPackage) {
      return res.status(404).json({ error: "Package not found" });
    }

    const newBooking = new bookingModel({
      date: new Date(),
      numberOfPeople,
      status: "Pending",
      user: userId,
      tourPackage: packageId,
    });

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
