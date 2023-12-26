import { roles } from "../../middleware/auth.js";

export const endPoints = {
  create: [roles.Admin],
  update: [roles.Admin],
  delete: [roles.Admin],
  getAll: [roles.Admin, roles.User],
  specific: [roles.Admin, roles.User],
};
