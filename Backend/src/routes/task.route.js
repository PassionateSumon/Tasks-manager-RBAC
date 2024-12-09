const express = require("express");
const { asyncFuncHandler } = require("../utils/asyncFuncHandler.util");
const {
  createTask,
  updateTask,
  deleteTask,
  getSingleTask,
  getAllTasksByRoles,
  getTasksOfUser,
} = require("../controller/task.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { verifyRoleAndPermission } = require("../middleware/role.middleware");
const router = express.Router();

router.post("/api/create-task", verifyToken, asyncFuncHandler(createTask));
router.put(
  "/api/update-task/:id/:t_id/:actionType",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(updateTask)
);
router.delete(
  "/api/delete-task/:id/:t_id/:actionType",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(deleteTask)
);
router.get(
  "/api/get-single-task/:id/:t_id/:actionType",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(getSingleTask)
);
router.get(
  "/api/get-all-tasks",
  verifyToken,
  asyncFuncHandler(getAllTasksByRoles)
);
router.get(
  "/api/get-tasks-by-actual-person/:id/:actionType",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(getTasksOfUser)
);

module.exports = router;
