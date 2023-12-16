import express from "express";
import "dotenv/config.js";
import initApp from "./src/modules/app.router.js";
const app = express();
const PORT = process.env.PORT || 3000;

initApp(app, express);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
