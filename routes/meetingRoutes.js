import express from "express";
import auth from "../middleware/auth.js";
import {
  createMeeting,
  getMeetings,
  getMeeting,
  joinMeeting,
  leaveMeeting,
  endMeeting,
  getMeetingByLink
} from "../controllers/meetingController.js";

const router = express.Router();

router.get("/", auth, getMeetings);
router.post("/", auth, createMeeting);
router.get("/join/:meetingLink", getMeetingByLink);
router.get("/:meetingId", auth, getMeeting);
router.post("/:meetingId/join", auth, joinMeeting);
router.post("/:meetingId/leave", auth, leaveMeeting);
router.post("/:meetingId/end", auth, endMeeting);

export default router;