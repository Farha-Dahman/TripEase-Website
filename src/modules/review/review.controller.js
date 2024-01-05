import reviewModel from "../../db/model/review.model.js";
import tourPackageModel from "../../db/model/tourPackage.model.js";
import userModel from "../../db/model/user.model.js";

export const createReview = async (req, res) => {
  const { tourPackageId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  const existingUser = await userModel.findById(userId);
  const existingTourPackage = await tourPackageModel.findById(tourPackageId);

  if (!existingUser || !existingTourPackage) {
    return res.status(404).json({ message: "User or Tour Package not found" });
  }

  const newReview = new reviewModel({
    user: req.user._id,
    tourPackage: tourPackageId,
    rating,
    comment,
  });

  const savedReview = await newReview.save();
  return res.status(201).json({ message: "success", review: savedReview });
};

export const getAllReviews = async (req, res) => {
  const reviews = await reviewModel.find();
  return res.status(200).json({ message: "success", reviews });
};

export const getReviewsForTourPackage = async (req, res) => {
  try {
    const { tourPackageId } = req.params;
    const reviews = await reviewModel.find({ tourPackage: tourPackageId });

    return res.status(200).json({ message: "success", reviews });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSpecificReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({ message: "success", review });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedReviewData = req.body;

    const updatedReview = await reviewModel.findByIdAndUpdate(
      reviewId,
      updatedReviewData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    return res.status(200).json({ message: "success", review: updatedReview });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await reviewModel.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "success", review: deletedReview });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
