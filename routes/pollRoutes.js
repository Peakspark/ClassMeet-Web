import express from "express";
import Poll from "../models/Poll.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create poll
router.post("/", auth, async (req, res) => {
  try {
    const { question, options, workspace } = req.body;

    const poll = await Poll.create({
      question,
      options: options.map((option) => ({
        text: option,
        votes: 0,
      })),
      workspace,
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Poll created successfully",
      poll,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create poll",
      error: error.message,
    });
  }
});

// Get polls of a workspace
router.get("/workspace/:workspaceId", auth, async (req, res) => {
  try {
    const polls = await Poll.find({
      workspace: req.params.workspaceId,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      polls,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch polls",
      error: error.message,
    });
  }
});

// Vote on a poll
router.post("/:pollId/vote", auth, async (req, res) => {
  try {
    const { optionIndex } = req.body;

    const poll = await Poll.findById(req.params.pollId);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    // Prevent multiple votes
    if (poll.voters.includes(req.user._id)) {
      return res.status(400).json({
        message: "You have already voted",
      });
    }

    if (
      optionIndex < 0 ||
      optionIndex >= poll.options.length
    ) {
      return res.status(400).json({
        message: "Invalid option",
      });
    }

    poll.options[optionIndex].votes += 1;
    poll.voters.push(req.user._id);

    await poll.save();

    res.status(200).json({
      message: "Vote recorded successfully",
      poll,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to vote",
      error: error.message,
    });
  }
});

// Delete poll
router.delete("/:pollId", auth, async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.pollId);

    if (!poll) {
      return res.status(404).json({
        message: "Poll not found",
      });
    }

    res.status(200).json({
      message: "Poll deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete poll",
      error: error.message,
    });
  }
});

export default router;