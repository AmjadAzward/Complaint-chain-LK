// controllers/commentController.js

import { db } from "../config/firebase.js"; // Firestore
import { v4 as uuidv4 } from "uuid";

// --------------------- ADD COMMENT ---------------------
export const addComment = async (req, res) => {
  try {
    const { complaintId, userId, userName, text } = req.body;

    if (!complaintId || !userId || !text) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const commentId = uuidv4();
    const timestamp = new Date().toISOString();

    const commentData = {
      commentId,
      complaintId,
      userId,
      userName: userName || "Anonymous",
      text,
      timestamp,
    };

    // Save comment under a subcollection for the complaint
    await db
      .collection("complaints")
      .doc(complaintId)
      .collection("comments")
      .doc(commentId)
      .set(commentData);

    res.status(201).json(commentData);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------- GET COMMENTS FOR A COMPLAINT ---------------------
export const getComments = async (req, res) => {
  try {
    const { complaintId } = req.params;

    if (!complaintId) {
      return res.status(400).json({ message: "Complaint ID is required." });
    }

    const snapshot = await db
      .collection("complaints")
      .doc(complaintId)
      .collection("comments")
      .orderBy("timestamp", "asc")
      .get();

    const comments = snapshot.docs.map((doc) => doc.data());

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
