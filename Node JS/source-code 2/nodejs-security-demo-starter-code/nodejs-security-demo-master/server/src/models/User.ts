import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    // INTENTIONALLY INSECURE:
    // We are storing raw passwords for the early insecure version.
    // Later sections will replace this with bcrypt hashing.
    password: {
      type: String,
      required: true,
    },

    // INTENTIONALLY SIMPLE:
    // Later we will use this for RBAC.
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
