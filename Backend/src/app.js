const express = require("express");
const cors = require("cors");
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
const moderateRouter = require("./routes/moderate.route");
const taskRouter = require("./routes/task.route");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.DEV_ENVIRONMENT
      ? process.env.DEV_CORS_ORIGIN
      : process.env.PRODUCTION_CORS_ORIGIN,
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send("<center><h1>Hello World!</h1></center>");
});
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/moderator", moderateRouter);
app.use("/task", taskRouter);

module.exports = app;
