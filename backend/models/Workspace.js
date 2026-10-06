import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: ["manager", "supervisor", "member"],
          default: "member",
        },

        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    rooms: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },

        type: {
          type: String,
          enum: ["meeting", "social", "work"],
          default: "work",
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;