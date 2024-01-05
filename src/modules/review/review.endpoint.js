import { roles } from "../../middleware/auth.js";

export const endPoints = {
  create: [roles.User],
  getAll: [roles.Admin],
  specific: [roles.Admin, roles.User],
  update: [roles.User],
  delete: [roles.User],
};
