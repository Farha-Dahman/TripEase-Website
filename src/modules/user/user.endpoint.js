import { roles } from "../../middleware/auth.js";

export const endPoints = {
  profile: [roles.Admin, roles.User],
  addFile: [roles.Admin, roles.User],
  change: [roles.Admin, roles.User],
};
