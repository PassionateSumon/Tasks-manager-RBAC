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

    const role = await Role.find({ name: process.env.USER_ROLE }); // as find() returns an array but findOne() returns single element
    // console.log(username);
    const createdUser = await User.create({
      name,
      email,
      username: username,
      password: hashedPassword,
      role: role[0]._id,
      permissions: [], //user has no permission initially
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
      .json(new apiErrorHandler(400, "Internal error to signup user!!"));
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
    const aggregatedUser = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(existedUser.id) },
      },
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "userRole",
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

    return res
      .status(200)
      .json(
        new apiResponseHandler(
          200,
          "Signin done!",
          token,
          aggregatedUser[0].userRole[0].name
        )
      );
  } catch (error) {
    return res
      .status(400)
      .json(new apiErrorHandler(400, "Internal error to signin user!!"));
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
            "You don't have permission to do update user profile!"
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
      return res.status(404).json(new apiErrorHandler(404, "User not found!"));
    }

    return res.status(200).json({
      user: updatedUser,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    return res
      .status(400)
      .json(new apiErrorHandler(400, "Internal error to update user!!"));
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
            "You don't have permission to do delete user profile!"
          )
        );
    }

    const user = await User?.findById(userId);
    if (!user) {
      return res.status(404).json(new apiErrorHandler(404, "User not found!"));
    }

    const userToDelete = await User?.findById(deleteUserId);
    if (!userToDelete) {
      return res.status(404).json({ message: "Not found user!" });
    }

    // Here i don't have to check whether he is user/admin/moderator
    // it can be done via role-middleware in route
    // so it's sure that who is here either user/admin

    await User?.findByIdAndDelete(deleteUserId);

    return res
      .status(200)
      .json(new apiResponseHandler(200, "User deleted successfully!"));
  } catch (error) {
    return res
      .status(400)
      .json(new apiErrorHandler(400, "Internal error to delete user!!"));
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
            "You don't have permission to do get user profile!"
          )
        );
    }

    const user = await User?.findById(userId);
    if (!user) {
      return res.status(404).json(new apiErrorHandler(404, "User not found!"));
    }
    if (!getUserId) {
      return res
        .status(404)
        .json(new apiErrorHandler(404, "User not authorize!"));
    }

    const userToGet = await User?.findById(getUserId);
    if (!userToGet) {
      return res.status(404).json({ message: "Not found user!" });
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
          new apiErrorHandler(404, "User is not present after aggregation!")
        );
    }

    return res
      .status(200)
      .json(
        new apiResponseHandler(200, "User successfully find!", allUserDetails)
      );
  } catch (error) {
    return res
      .status(400)
      .json(new apiErrorHandler(400, "Internal error to get user!!"));
  }
};

exports.getAllUsersProfiles = async (req, res) => {
  try {
    const loggedInUserId = req?.user?.id;
    if (!loggedInUserId)
      return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
    const roleOfLoggedInUser = await User.aggregate([
      {
        $match: {
          _id: loggedInUserId,
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

    const users = await User.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "updatedRoles",
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
        $match: {
          $expr: {
            $and: [
              { $gt: [{ $size: "$updatedRoles" }, 0] }, // Ensure updatedRoles[0] exists
              { $eq: [{ $arrayElemAt: ["$updatedRoles.name", 0] }, "user"] },
            ],
          },
        },
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    if (!users)
      return res.status(404).json(new apiErrorHandler(404, "Users not found"));
    const roleName = roleOfLoggedInUser[0]?.role[0]?.name;
    if (
      roleName === process.env.ADMIN_ROLE ||
      roleName === process.env.MODERATOR_ROLE
    ) {
      return res.status(200).json(new apiResponse(200, "All Users", users));
    }
  } catch (error) {
    return res
      .status(401)
      .json(
        new apiErrorHandler(401, "You don't have permission to get all users")
      );
  }
};
