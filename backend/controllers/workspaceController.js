import Workspace from "../models/Workspace.js";
import User from "../models/User.js";


// CREATE WORKSPACE
export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required",
      });
    }

    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user.id,
      members: [
        {
          user: req.user.id,
          role: "manager",
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    console.error("Create workspace error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET MY WORKSPACES
export const getMyWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user.id,
      isActive: true,
    })
      .populate("owner", "name email")
      .populate("members.user", "name email role");

    return res.status(200).json({
      success: true,
      workspaces,
    });
  } catch (error) {
    console.error("Get workspaces error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// GET SINGLE WORKSPACE
export const getWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user.id,
      isActive: true,
    })
      .populate("owner", "name email")
      .populate("members.user", "name email role");

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found or access denied",
      });
    }

    return res.status(200).json({
      success: true,
      workspace,
    });
  } catch (error) {
    console.error("Get workspace error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ADD MEMBER
export const addMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role = "member" } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    if (!["manager", "supervisor", "member"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (workspace.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the workspace manager can add members",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyMember = workspace.members.some(
      (member) => member.user.toString() === user.id.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({
        success: false,
        message: "User is already a member",
      });
    }

    workspace.members.push({
      user: user.id,
      role,
    });

    await workspace.save();

    return res.status(200).json({
      success: true,
      message: "Member added successfully",
      workspace,
    });
  } catch (error) {
    console.error("Add member error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// REMOVE MEMBER
export const removeMember = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (workspace.owner.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the workspace manager can remove members",
      });
    }

    if (workspace.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Workspace owner cannot be removed",
      });
    }

    workspace.members = workspace.members.filter(
      (member) => member.user.toString() !== userId
    );

    await workspace.save();

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Remove member error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ADD ROOM
export const addRoom = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, type = "work" } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Room name is required",
      });
    }

    if (!["meeting", "social", "work"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room type",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Only workspace owner can create rooms
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the workspace manager can create rooms",
      });
    }

    workspace.rooms.push({
      name,
      type,
    });

    await workspace.save();

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: workspace.rooms[workspace.rooms.length - 1],
    });
  } catch (error) {
    console.error("Add room error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// DELETE ROOM
export const deleteRoom = async (req, res) => {
  try {
    const { workspaceId, roomId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the workspace manager can delete rooms",
      });
    }

    const room = workspace.rooms.id(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    room.deleteOne();

    await workspace.save();

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Delete room error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};