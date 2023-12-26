import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Canceled"],
    default: "Pending",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tourPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourPackage",
    required: true,
  },
  numberOfPeople: { type: Number, required: true },
  specialRequests: { type: String },
});

const bookingModel = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default bookingModel;
