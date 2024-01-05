import connectionDB from "../db/connection.js";
import { globalErrorHandler } from "../services/errorHandling.js";
import authRouter from "./auth/auth.router.js";
import tourPackageRouter from "./tourPackage/tourPackage.router.js";
import bookingRouter from "./booking/booking.router.js";
import userRouter from "./user/user.router.js";
import blogRouter from "./blog/blog.router.js";

const initApp = (app, express) => {
  app.use(express.json());
  connectionDB();
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome" });
  });
  app.use("/auth", authRouter);
  app.use("/tourPackage", tourPackageRouter);
  app.use("/booking", bookingRouter);
  app.use("/user", userRouter);
  app.use("/blog", blogRouter);

  app.get("*", (req, res) => {
    return res.status(500).json({ message: "Page not found" });
  });
  app.use(globalErrorHandler);
};

export default initApp;
