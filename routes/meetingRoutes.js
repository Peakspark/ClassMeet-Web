import express from "express";
import auth from "../middleware/auth.js";

import {
  createMeeting,
  getMeetings,
  getMeeting,
  joinMeeting,
  leaveMeeting,
  endMeeting
} from "../controllers/meetingController.js";

const router = express.Router();

// Get all meetings of logged-in user
router.get("/", auth, getMeetings);

// Create / schedule meeting
router.post("/", auth, createMeeting);

// Get one meeting
router.get("/:meetingId", auth, getMeeting);

// Join meeting
router.post("/:meetingId/join", auth, joinMeeting);

// Leave meeting
router.post("/:meetingId/leave", auth, leaveMeeting);

// End meeting
router.post("/:meetingId/end", auth, endMeeting);

export default router;