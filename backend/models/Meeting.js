import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    title: {
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

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    scheduledAt: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["scheduled", "live", "ended", "cancelled"],
      default: "scheduled",
    },

    meetingLink: {
      type: String,
      unique: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;