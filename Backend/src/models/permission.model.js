const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
  {
    task: {
      type: String,
    },
    profile: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.Schema("Permission", permissionSchema);
