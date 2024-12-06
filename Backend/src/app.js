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
    origin: "",
    credentials: true,
  })
);
app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/moderator", moderateRouter);
app.use("/task", taskRouter);

module.exports = app;
