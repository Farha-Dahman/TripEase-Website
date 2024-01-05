import joi from "joi";
import { Types } from "mongoose";

const dataMethods = ["body", "query", "headers", "params", "file"];
const validationObjectID = (value, helper) => {
  if (Types.ObjectId.isValid(value)) {
    return value;
  } else {
    return helper.error("any.custom", { message: "Invalid ObjectId" });
  }
};

export const generalFelids = {
  id: joi.string().custom(validationObjectID).required(),
  email: joi.string().email().required().min(5).messages({
    "string.empty": "email is required",
    "string.email": "plz enter a valid email",
    "string.min": "email length must be at least 5 characters",
  }),
  password: joi.string().min(5).required().messages({
    "string.empty": "password is required",
  }),
  file: joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().positive().required(),
  }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const validationArray = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationArray.push(validationResult.error.details);
        }
      }
    });
    if (validationArray.length > 0) {
      return res
        .status(400)
        .json({ message: "validation error", validationArray });
    } else {
      next();
    }
  };
};
