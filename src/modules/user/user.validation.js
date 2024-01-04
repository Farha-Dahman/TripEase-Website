import joi from "joi";
import { generalFelids } from "../../middleware/validation.js";

export const profileVal = {
  file: generalFelids.file.required(),
};

export const updatePassword = {
  body: joi.object({
    oldPassword: generalFelids.password,
    newPassword: generalFelids.password.invalid(joi.ref("oldPassword")),
    cPassword: joi.string().valid(joi.ref("newPassword")).required(),
  }),
};

export const sharedProfile = {
  params: joi.object({
    id: generalFelids.id,
  }),
};
