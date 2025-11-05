// routes/commentRoutes.js

import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";

const router = express.Router();

// --------------------- Comments Routes ---------------------

// Add a new comment to a complaint
router.post("/add", addComment);

// Get all comments for a specific complaint
router.get("/:complaintId", getComments);

export default router;
