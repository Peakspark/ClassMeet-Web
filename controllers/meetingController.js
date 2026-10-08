import crypto from "crypto";
import Meeting from "../models/Meeting.js";
import Workspace from "../models/Workspace.js";


// CREATE / SCHEDULE MEETING
export const createMeeting = async (req, res) => {
  try {
    const {
      title,
      description,
      workspaceId,
      roomId,
      scheduledAt,
    } = req.body;

    if (!title || !workspaceId || !roomId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: "Title, workspace, room and scheduled time are required",
      });
    }

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user.id,
      isActive: true,
    });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found or access denied",
      });
    }

    const room = workspace.rooms.id(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const meeting = await Meeting.create({
      title,
      description,
      workspace: workspaceId,
      room: roomId,
      host: req.user.id,
      participants: [req.user.id],
      scheduledAt,
      meetingLink: crypto.randomUUID(),
    });

    return res.status(201).json({
      success: true,
      message: "Meeting scheduled successfully",
      meeting,
    });
  } catch (error) {
    console.error("Create meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL MEETINGS FOR CURRENT USER
export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({
      participants: req.user.id
    })
      .populate("host", "name email role")
      .populate("workspace", "name")
      .sort({ scheduledAt: 1 });

    return res.status(200).json({
      success: true,
      meetings
    });
  } catch (error) {
    console.error("Get meetings error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// GET ONE MEETING
export const getMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId)
      .populate("host", "name email role")
      .populate("participants", "name email role")
      .populate("workspace", "name");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const isParticipant = meeting.participants.some(
      (participant) =>
        participant._id.toString() === req.user.id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not a participant of this meeting",
      });
    }

    return res.status(200).json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error("Get meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// JOIN MEETING
export const joinMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    if (meeting.status === "ended" || meeting.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "This meeting is no longer available",
      });
    }

    const alreadyJoined = meeting.participants.some(
      (participant) =>
        participant.toString() === req.user.id.toString()
    );

    if (!alreadyJoined) {
      meeting.participants.push(req.user.id);
      await meeting.save();
    }

    return res.status(200).json({
      success: true,
      message: "Joined meeting successfully",
      meeting,
    });
  } catch (error) {
    console.error("Join meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// LEAVE MEETING
export const leaveMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    meeting.participants = meeting.participants.filter(
      (participant) =>
        participant.toString() !== req.user.id.toString()
    );

    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Left meeting successfully",
    });
  } catch (error) {
    console.error("Leave meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// END MEETING
export const endMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    if (meeting.host.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the host can end the meeting",
      });
    }

    meeting.status = "ended";

    await meeting.save();

    return res.status(200).json({
      success: true,
      message: "Meeting ended successfully",
    });
  } catch (error) {
    console.error("End meeting error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMeetingByLink = async (req, res) => {
  try {
    const { meetingLink } = req.params;

    const meeting = await Meeting.findOne({ meetingLink })
      .populate("host", "name email")
      .populate("workspace", "name");

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found or link is invalid"
      });
    }

    return res.status(200).json({
      success: true,
      meeting: {
        id: meeting._id,
        title: meeting.title,
        meetingLink: meeting.meetingLink,
        host: meeting.host,
        scheduledAt: meeting.scheduledAt
      }
    });

  } catch (error) {
    console.error("Get meeting by link error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};