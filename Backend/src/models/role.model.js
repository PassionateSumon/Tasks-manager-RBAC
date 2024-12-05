const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: {
        values: ["user", "moderator", "admin"],
        message: "{VALUE} is not valid role",
      },
      default: "user",
      index: true,
    },
    permissions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "permission",
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Role", roleSchema);
