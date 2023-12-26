import tourPackageModel from "../../db/model/tourPackage.model.js";
import cloudinary from "../../services/cloudinary.js";

export const addTourPackage = async (req, res) => {
  try {
    const {
      title,
      description,
      destinations,
      price,
      duration,
      includes,
      startDate,
      endDate,
      maxCapacity,
    } = req.body;
    console.log(req.body);
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/TourPackages`,
      }
    );

    const newTourPackage = await tourPackageModel.create({
      title,
      description,
      destinations,
      price,
      duration,
      includes,
      startDate,
      endDate,
      maxCapacity,
      images: [{ public_id, secure_url }],
    });

    return res.status(201).json({ message: "success", newTourPackage });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

export const updateTourPackage = async (req, res) => {
  try {
    const { packageId } = req.params;
    const tourPackage = await tourPackageModel.findById(packageId);
    if (!tourPackage) {
      return res
        .status(404)
        .json({ message: "This tour package is not found!" });
    }

    if (req.body.title) {
      tourPackage.title = req.body.title;
    }
    if (req.body.description) {
      tourPackage.description = req.body.description;
    }
    if (req.body.destinations) {
      tourPackage.destinations = req.body.destinations;
    }
    if (req.body.price) {
      tourPackage.price = req.body.price;
    }
    if (req.body.duration) {
      tourPackage.duration = req.body.duration;
    }
    if (req.body.includes) {
      tourPackage.includes = req.body.includes;
    }
    if (req.body.startDate) {
      tourPackage.startDate = req.body.startDate;
    }
    if (req.body.endDate) {
      tourPackage.endDate = req.body.endDate;
    }
    if (req.body.maxCapacity) {
      tourPackage.maxCapacity = req.body.maxCapacity;
    }

    await tourPackage.save();
    return res.status(200).json({ message: "success", tourPackage });
  } catch (error) {
    return next(new Error("Internal Server Error", { cause: 500 }));
  }
};

export const deleteTourPackage = async (req, res, next) => {
  try {
    const tourPackageId = req.params.packageId;
    const deletedTourPackage = await tourPackageModel.findByIdAndDelete(
      tourPackageId
    );

    if (!deletedTourPackage) {
      return next(new Error("Tour Package not found", { cause: 404 }));
    }
    return res.status(200).json({ message: "success" });
  } catch (error) {
    return next(new Error("Internal Server Error", { cause: 500 }));
  }
};

export const browsePackages = async (req, res, next) => {
  try {
    const packages = await tourPackageModel.find();
    return res.status(200).json({ message: "success", packages });
  } catch (error) {
    return next(new Error("Internal Server Error", { cause: 500 }));
  }
};

export const viewPackageDetails = async (req, res, next) => {
  try {
    const { packageId } = req.params;
    const packageDetails = await tourPackageModel.findById(packageId);

    if (!packageDetails) {
      return next(new Error("Package not found", { cause: 404 }));
    }
    return res.status(200).json({ message: "success", packageDetails });
  } catch (error) {
    return next(new Error("Internal Server Error", { cause: 500 }));
  }
};
