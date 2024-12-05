const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const apiErrorHandler = require("../utils/apiErrorHandler.util");
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers?.authorization;
    // console.log(token)
    if (!token) {
      return res
        .status(403)
        .json(new apiErrorHandler(401, "Authorization token missing!"));
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    if (!decodedToken) {
      return res.status(404).json({ message: "Token can't be decoded!" });
    }
    const existedUser = await User.findById(decodedToken.id);

    if (!existedUser) {
      return res
        .status(403)
        .json(new apiErrorHandler(403, "Invalid token or user doesn't exist!"));
    }

    // console.log(first)
    req.user = { id: existedUser._id };
    next();
  } catch (error) {
    return res.status(401).json(new apiErrorHandler(401, "Unauthorized"));
  }
};
