import connectionDB from "../db/connection.js";
import { globalErrorHandler } from "../services/errorHandling.js";
import authRouter from "./auth/auth.router.js";

const initApp = (app, express) => {
  app.use(express.json());
  connectionDB();
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome" });
  });
  app.use("/auth", authRouter);

  app.get("*", (req, res) => {
    return res.status(500).json({ message: "Page not found" });
  });
  app.use(globalErrorHandler);
};

export default initApp;
