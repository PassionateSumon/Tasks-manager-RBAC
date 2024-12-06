const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const apiErrorHandler = require("../utils/apiErrorHandler.util");
const apiResponseHandler = require("../utils/apiResponseHandler.util");
const mongoose = require("mongoose");
const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
  try {
    const requiredBody = z.object({
      name: z
        .string()
        .min(2, { message: "Too small name" })
        .max(50, { message: "Too big name" }),
      email: z.string().email(),
      password: z
        .string()
        .min(6, { message: "Too small password" })
        .max(100, { message: "max reached" })
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
        ),
    });

    const parsedBody = requiredBody.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: parsedBody.error.issues,
        message: "Incorrect format!",
      });
    }

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(409).json({ message: "Already exist user!" });
    }

    const username = `${Math.random() * 1928374650}_${Date.now()}`;

    const role = await Role.find({ name: process.env.ADMIN_ROLE }); // as find() returns an array but findOne() returns single element
    // console.log(role)
    const createdUser = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
      role: role[0]._id,
      permissions: role[0].permissions,
    });
    if (!createdUser) {
      return res.status(500).json({ message: "Internal server error!" });
    }

    return res
      .status(200)
      .json({ user: createdUser, message: "You're signed up!" });
  } catch (error) {
    return res
      .status(400)
      .json(new apiErrorHandler(400, "Internal error to signup admin!!"));
  }
};

exports.signin = async (req, res) => {
  try {
    const requiredBody = z.object({
      email: z.string().email(),
      password: z.string(),
    });
    const parsedBody = requiredBody.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: parsedBody.error.issues,
        message: "Invalid credentials!",
      });
    }

    const { email, password } = req.body;
    const existedUser = await User.findOne({ email });
    if (!existedUser) {
      return res.status(403).json({ message: "Invalid email!" });
    }

    const matchedPassword = await bcrypt.compare(
      password,
      existedUser.password
    );
    if (!matchedPassword) {
      return res.status(403).json({ message: "Invalid password!" });
    }

    // console.log(JWT_SECRET);
    const token = jwt.sign(
      {
        id: existedUser._id.toString(),
      },
      JWT_SECRET
    );

    return res.status(200).json({ existedUser, token });
  } catch (error) {
    return res
      .status(400)
      .json(new apiErrorHandler(400, "Internal error to signin admin!!"));
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    const userRole = req?.role;
    // console.log(userRole);
    if (!userRole) {
      return res
        .status(403)
        .json(
          new apiErrorHandler(
            403,
            "You don't have permission to do update admin profile!"
          )
        );
    }

    const allowedFields = ["name", "email", "password", "age"];
    const updates = {};

    for (const key of Object.keys(req.body)) {
      if (allowedFields.includes(key)) {
        updates[key] = req?.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json(new apiErrorHandler(400, "No valid fields to update!"));
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json(new apiErrorHandler(404, "admin not found!"));
    }

    return res.status(200).json({
      user: updatedUser,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    return res
      .status(400)
      .json(new apiErrorHandler(400, "Internal error to update admin!!"));
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const deleteUserId = req?.params?.id;

    const userRole = req?.role;
    if (!userRole) {
      return res
        .status(403)
        .json(
          new apiErrorHandler(
            403,
            "You don't have permission to do delete admin profile!"
          )
        );
    }

    const user = await User?.findById(userId);
    if (!user) {
      return res.status(404).json(new apiErrorHandler(404, "Admin not found!"));
    }

    const userToDelete = await User?.findById(deleteUserId);
    if (!userToDelete) {
      return res.status(404).json({ message: "Not found admin!" });
    }

    // Here i don't have to check whether he is user/admin/moderator
    // it can be done via role-middleware in route
    // so it's sure that who is here either user/admin

    await User?.findByIdAndDelete(deleteUserId);

    return res
      .status(200)
      .json(new apiResponseHandler(200, "Admin deleted successfully!"));
  } catch (error) {
    return res
      .status(400)
      .json(new apiErrorHandler(400, "Internal error to delete admin!!"));
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const getUserId = req?.params?.id;

    const userRole = req?.role;
    if (!userRole) {
      return res
        .status(403)
        .json(
          new apiErrorHandler(
            403,
            "You don't have permission to do get Admin profile!"
          )
        );
    }

    const user = await User?.findById(userId);
    if (!user) {
      return res.status(404).json(new apiErrorHandler(404, "Admin not found!"));
    }
    if (!getUserId) {
      return res
        .status(404)
        .json(new apiErrorHandler(404, "Admin not authorize!"));
    }

    const userToGet = await User?.findById(getUserId);
    if (!userToGet) {
      return res.status(404).json({ message: "Not found admin!" });
    }

    const allUserDetails = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(getUserId),
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "roles",
        },
      },
      {
        $lookup: {
          from: "permissions",
          localField: "permissions",
          foreignField: "_id",
          as: "permissions",
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    if (!allUserDetails) {
      return res
        .status(404)
        .json(
          new apiErrorHandler(404, "Admin is not present after aggregation!")
        );
    }

    return res
      .status(200)
      .json(
        new apiResponseHandler(200, "Admin successfully find!", allUserDetails)
      );
  } catch (error) {
    return res
      .status(400)
      .json(new apiErrorHandler(400, "Internal error to get admin!!"));
  }
};

exports.getAllPermissionsByRole = async (req, res) => {
  try {
    const loggedInAdminId = req?.user?.id;
    const admin = await User.aggregate([
      {
        $match: {
          _id: loggedInAdminId,
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
    ]);
    const roleName = admin[0]?.role[0]?.name;

    let allRolePermissionsForAdmin,
      allRolePermissionsForModerator,
      allRolePermissionsForUser;
    switch (roleName) {
      case process.env.ADMIN_ROLE:
        allRolePermissionsForAdmin = await Role.aggregate([
          {
            $lookup: {
              from: "permissions",
              localField: "permissions",
              foreignField: "_id",
              as: "permissions",
            },
          },
        ]);
        break;
      case process.env.MODERATOR_ROLE:
        allRolePermissionsForModerator = await Role.aggregate([
          {
            $match: {
              name: { $ne: process.env.ADMIN_ROLE },
            },
          },
          {
            $lookup: {
              from: "permissions",
              localField: "permissions",
              foreignField: "_id",
              as: "permissions",
            },
          },
        ]);
        break;
      case process.env.USER_ROLE:
        allRolePermissionsForUser = await Role.aggregate([
          {
            $match: {
              $and: [
                { name: { $ne: "admin" } },
                { name: { $ne: "moderator" } },
              ], //using "and" query to combinely differentiate
            },
          },
          {
            $lookup: {
              from: "permissions",
              localField: "permissions",
              foreignField: "_id",
              as: "permissions",
            },
          },
        ]);
        break;
    }

    if (roleName === process.env.ADMIN_ROLE)
      return res
        .status(200)
        .json(
          new apiResponse(200, "Permissions found", allRolePermissionsForAdmin)
        );
    if (roleName === process.env.MODERATOR_ROLE)
      return res
        .status(200)
        .json(
          new apiResponse(
            200,
            "Permissions found",
            allRolePermissionsForModerator
          )
        );
    if (roleName === process.env.USER_ROLE)
      return res
        .status(200)
        .json(
          new apiResponse(200, "Permissions found", allRolePermissionsForUser)
        );
  } catch (error) {
    return res
      .status(400)
      .json(
        new apiErrorHandler(
          400,
          "Internal server error to get all permissions by role!!!"
        )
      );
  }
};

// Only "moderator" role's permissions can be changed by the admin 
exports.changePermissionsOfModeratorByAdmin = async (req, res) => {
  try {
    const loggedInAdminId = req?.user?.id;
    const admin = await User.aggregate([
      {
        $match: {
          _id: loggedInAdminId,
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
    ]);
    const roleName = admin[0]?.role[0]?.name;

    if (roleName === process.env.ADMIN_ROLE) {
      const { roleId, permissions } = req?.body;
      if (permissions.length === 0)
        return res
          .status(400)
          .json(
            new apiErrorHandler(400, "Permissions are required to update role")
          );

      const role = await Role.findById(new mongoose.Types.ObjectId(roleId)); //"findByIdAndUpdate" can't be used**
      if (!role)
        return res.status(404).json(new apiErrorHandler(404, "Role not found"));

      // Important part ***
      if (role.name === process.env.MODERATOR_ROLE) {
        role.permissions = permissions.map(
          (permission) => new mongoose.Types.ObjectId(permission)
        ); //in frontend permissions initial array should contain the initial permissions

        const updatedRole = await role.save();
        if (!updatedRole)
          return res
            .status(500)
            .json(
              new apiErrorHandler(
                500,
                "Role not updated for some unknown reason"
              )
            );

        return res.status(200).json(new apiResponse(200, "Role updated", role));
      }
    }
    return res
      .status(401)
      .json(
        new apiErrorHandler(401, "You don't have the permission to update role")
      );
  } catch (error) {
    return res
      .status(400)
      .json(
        new apiErrorHandler(
          400,
          "Internal server error for shifting user to moderator role by admin!!!"
        )
      );
  }
};

exports.increaseAndDecreasePersonRoleByAdmin = async (req, res) => {
  try {
    const userId = req?.params?.id;
    const loggedInAdminId = req?.user?.id;
    const role = req?.role;
    const { roleId } = req?.body; // the role to which the user is to be promoted or demoted
    if (!loggedInAdminId)
      return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
    if (!role)
      return res
        .status(401)
        .json(
          new apiErrorHandler(
            401,
            "You don't have the permission to promote a person"
          )
        );
    if (!userId)
      return res
        .status(400)
        .json(
          new apiErrorHandler(
            400,
            "User id is required to be promoted or demoted"
          )
        );

    const user = await User.findById(new mongoose.Types.ObjectId(userId));
    if (!user)
      return res.status(404).json(new apiErrorHandler(404, "User not found"));

    const userRoleAggregation = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
    ]);
    if (!userRoleAggregation)
      return res
        .status(500)
        .json(
          new apiErrorHandler(
            500,
            "User role not found in increaseAndDecreasePersonRoleByAdmin!!"
          )
        );
    const userRole = userRoleAggregation[0]?.role[0]?.name;
    if (userRole === process.env.ADMIN_ROLE)
      return res
        .status(400)
        .json(new apiErrorHandler(400, "Admin cannot be promoted or demoted!"));

    const RoleTobeUpdated = await Role.findById(
      new mongoose.Types.ObjectId(roleId)
    ); // given roleId is valid or not

    if (!RoleTobeUpdated)
      return res
        .status(404)
        .json(new apiErrorHandler(404, "Role not found by given Id!"));

    if (userRole === RoleTobeUpdated?.name)
      return res
        .status(400)
        .json(
          new apiErrorHandler(
            400,
            "This person is already in the same role. No need to update!!"
          )
        );

    user.role = new mongoose.Types.ObjectId(roleId); //user role updated
    user.permissions = RoleTobeUpdated.permissions; //user permissions updated
    const userAfterSave = await user.save();

    if (!userAfterSave)
      return res
        .status(500)
        .json(
          new apiErrorHandler(
            500,
            "This person is not updated for some unknown reason!!"
          )
        );
    return res
      .status(200)
      .json(new apiResponse(200, "User role updated", user));
  } catch (error) {
    return res
      .status(400)
      .json(
        new apiErrorHandler(
          400,
          "Internal server error for upgrading role by admin!!!"
        )
      );
  }
};
