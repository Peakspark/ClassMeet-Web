import express from "express";

// import {
//   createMeeting,
//   getMeeting,
//   joinMeeting,
//   leaveMeeting,
//   endMeeting,
// } from "../controllers/meetingController.js";
import {
  createMeeting,
  getMeetings,
  getMeeting,
  joinMeeting,
  leaveMeeting,
  endMeeting,
} from "../controllers/meetingController.js";

import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, createMeeting);

router.get("/", auth, getMeetings);

router.get("/:meetingId", auth, getMeeting);

router.post("/:meetingId/join", auth, joinMeeting);

router.post("/:meetingId/leave", auth, leaveMeeting);

router.post("/:meetingId/end", auth, endMeeting);

export default router;