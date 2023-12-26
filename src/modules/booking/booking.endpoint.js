import { roles } from "../../middleware/auth.js";

export const endPoints = {
  add: [roles.User],
  cancel: [roles.User],
  getAll: [roles.User],
  specific: [roles.User],
};
