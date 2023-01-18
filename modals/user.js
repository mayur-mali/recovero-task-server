const mongoose = require("mongoose");

// creating the schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "member"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// creating model from the schema
const userModal = mongoose.model("User", userSchema);
module.exports = userModal;
