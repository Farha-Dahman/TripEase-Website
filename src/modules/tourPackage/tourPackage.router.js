import { Router } from "express";
import * as tourPackageController from "./tourPackage.controller.js";
import { endPoints } from "./tourPackage.endpoint.js";
import { auth } from "../../middleware/auth.js";
import fileUpload, { fileValidation } from "../../services/multer.js";
const router = Router();

router.get(
  "/packages",
  auth(endPoints.getAll),
  tourPackageController.browsePackages
);
router.get(
  "/packages/:packageId",
  auth(endPoints.specific),
  tourPackageController.viewPackageDetails
);
router.post(
  "/addPackages",
  fileUpload(fileValidation.image).single("images"),
  auth(endPoints.create),
  tourPackageController.addTourPackage
);
router.put(
  "/packages/:packageId",
  auth(endPoints.update),
  tourPackageController.updateTourPackage
);
router.delete(
  "/packages/:packageId",
  auth(endPoints.delete),
  tourPackageController.deleteTourPackage
);

export default router;
