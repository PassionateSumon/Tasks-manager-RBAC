const express = require("express");
const { asyncFuncHandler } = require("../utils/asyncFuncHandler.util");
const {
  signup,
  signin,
  updateProfile,
  deleteProfile,
  getUserProfile,
} = require("../controller/moderator.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { verifyRoleAndPermission } = require("../middleware/role.middleware");
const { getAllUsersProfiles } = require("../controller/user.controller");

const router = express.Router();

router.post("/api/signup", asyncFuncHandler(signup));
router.post("/api/signin", asyncFuncHandler(signin));
router.put(
  "/api/update-pro/:id/:actionType",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(updateProfile)
);
router.delete(
  "/api/delete-pro/:id/:actionType",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(deleteProfile)
);
router.get(
  "/api/get-user-profile/:id/:actionType",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(getUserProfile)
);
router.get(
  "/api/get-all-user-profile",
  verifyToken,
  asyncFuncHandler(getAllUsersProfiles)
); // get all profiles of users

module.exports = router;
