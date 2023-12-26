import mongoose from "mongoose";

const tourPackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  destinations: [{ type: String }],
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  includes: [{ type: String }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  maxCapacity: { type: Number, required: true },
  images: [{ type: Object }],
});

const tourPackageModel =
  mongoose.models.TourPackage ||
  mongoose.model("TourPackage", tourPackageSchema);

export default tourPackageModel;
