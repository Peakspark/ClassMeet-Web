import express from "express";

import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspace,
  addMember,
  removeMember,
  addRoom,
  deleteRoom,
} from "../controllers/workspaceController.js";

import auth from "../middleware/auth.js";

const router = express.Router();


// Create workspace
router.post("/", auth, createWorkspace);


// Get all workspaces of logged-in user
router.get("/", auth, getMyWorkspaces);


// Get one workspace
router.get("/:workspaceId", auth, getWorkspace);


// Add member
router.post("/:workspaceId/members", auth, addMember);


// Remove member
router.delete(
  "/:workspaceId/members/:userId",
  auth,
  removeMember
);

// Add room
router.post("/:workspaceId/rooms", auth, addRoom);

// Delete room
router.delete(
  "/:workspaceId/rooms/:roomId",
  auth,
  deleteRoom
);

export default router;