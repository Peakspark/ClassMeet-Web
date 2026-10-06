import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a task
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, workspace, assignedTo, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      workspace,
      assignedTo,
      createdBy: req.user._id,
      dueDate,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task",
      error: error.message,
    });
  }
});

// Get all tasks of a workspace
router.get("/workspace/:workspaceId", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      workspace: req.params.workspaceId,
    })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message,
    });
  }
});

// Get my assigned tasks
router.get("/my-tasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user._id,
    })
      .populate("workspace", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch your tasks",
      error: error.message,
    });
  }
});

// Update task
router.put("/:taskId", auth, async (req, res) => {
  try {
    const { title, description, assignedTo, status, dueDate } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      {
        title,
        description,
        assignedTo,
        status,
        dueDate,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update task",
      error: error.message,
    });
  }
});

// Delete task
router.delete("/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete task",
      error: error.message,
    });
  }
});

export default router;