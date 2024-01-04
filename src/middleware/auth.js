import jwt from "jsonwebtoken";
import userModel from "../db/model/user.model.js";

export const roles = {
  Admin: "Admin",
  User: "User",
};

export const auth = (accessRoles = []) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization?.startsWith(process.env.BEARER_KEY)) {
      return res.status(400).json({ message: "Invalid authorization!" });
    }
    const token = authorization.split(process.env.BEARER_KEY)[1];
    const decoded = jwt.verify(token, process.env.LOGIN_SECRET);
    if (!decoded) {
      return res.status(400).json({ message: "Invalid authorization!" });
    }
    const user = await userModel.findById(decoded.id).select("userName role email");
    if (!user) {
      return res.status(400).json({ message: "Not registered user" });
    }

    if (!accessRoles.includes(user.role)) {
      console.log(user.role)
      return res.status(403).json({ message: "Not auth user!" });
    }
    req.user = user;
    next();
  };
};
