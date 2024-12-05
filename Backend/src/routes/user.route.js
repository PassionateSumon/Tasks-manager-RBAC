const express = require("express");
const { asyncFuncHandler } = require("../utils/asyncFuncHandler.util");
const {
  signup,
  signin,
  updateProfile,
  deleteProfile,
} = require("../controller/user.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { verifyRoleAndPermission } = require("../middleware/role.middleware");
const router = express.Router();

router.post("/api/signup", asyncFuncHandler(signup));
router.post("/api/signin", asyncFuncHandler(signin));
router.put(
  "/api/update-pro/:id/:profile_action_update",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(updateProfile)
);
router.delete(
  "/api/delete-pro/:id",
  verifyToken,
  asyncFuncHandler(deleteProfile)
);

module.exports = router;
