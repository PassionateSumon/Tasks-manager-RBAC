const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    username: { type: String, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
    },
    permissions: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
