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

// Create / schedule a meeting
router.post("/", auth, createMeeting);

// Get one meeting
router.get("/:meetingId", auth, getMeeting);

// Join a meeting
router.post("/:meetingId/join", auth, joinMeeting);

// Leave a meeting
router.post("/:meetingId/leave", auth, leaveMeeting);

// End a meeting
router.post("/:meetingId/end", auth, endMeeting);

export default router;