import express from "express";
import auth from "../middleware/auth.js";
import Meeting from "../models/Meeting.js";
import Task from "../models/Task.js";
import Poll from "../models/Poll.js";

const router = express.Router();

router.get("/workspace/:workspaceId", auth, async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const [
      totalMeetings,
      totalTasks,
      completedTasks,
      pendingTasks,
      totalPolls,
    ] = await Promise.all([
      Meeting.countDocuments({ workspace: workspaceId }),
      Task.countDocuments({ workspace: workspaceId }),
      Task.countDocuments({
        workspace: workspaceId,
        status: "completed",
      }),
      Task.countDocuments({
        workspace: workspaceId,
        status: { $ne: "completed" },
      }),
      Poll.countDocuments({ workspace: workspaceId }),
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalMeetings,
        totalTasks,
        completedTasks,
        pendingTasks,
        totalPolls,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
});

export default router;