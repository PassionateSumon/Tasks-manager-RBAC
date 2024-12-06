const express = require("express");
const { asyncFuncHandler } = require("../utils/asyncFuncHandler.util");
const {
  signup,
  signin,
  updateProfile,
  deleteProfile,
  getUserProfile,
  getAllPermissionsByRole,
  increaseAndDecreasePersonRoleByAdmin,
  getAllUsersProfiles,
  changePermissionsOfModeratorByAdmin,
} = require("../controller/admin.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { verifyRoleAndPermission } = require("../middleware/role.middleware");
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
  asyncFuncHandler(deleteProfile)
);
router.get(
  "/api/get-user-profile/:id/:actionType",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(getUserProfile)
);
router.get(
  "/api/get-all-user-profile/",
  verifyToken,
  asyncFuncHandler(getAllUsersProfiles)
);
router.get(
  "/api/get-all-users-permission",
  verifyToken,
  asyncFuncHandler(getAllPermissionsByRole)
);
router.put(
  "/api/change-permissions-moderator",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(changePermissionsOfModeratorByAdmin)
);
router.patch(
  "/api/update-person-role-by-admin/:id",
  verifyToken,
  verifyRoleAndPermission,
  asyncFuncHandler(increaseAndDecreasePersonRoleByAdmin)
);

module.exports = router;
