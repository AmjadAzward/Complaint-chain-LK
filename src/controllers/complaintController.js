// controllers/complaintController.js

import { db } from "../config/firebase.js"; // Firestore
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { supabase } from "../config/supabaseClient.js";

// Multer setup
export const uploadComplaintFile = multer({ storage: multer.memoryStorage() }).single("file");

// --------------------- SUBMIT COMPLAINT ---------------------
export const submitComplaint = async (req, res) => {
  try {
    const { category, description, priority, visibility, lat, lng, address, userId } = req.body;

    if (!category || !description || !lat || !lng) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const complaintId = uuidv4();
    let fileURL = null;

    console.log("Received complaint data:", { category, description, priority, visibility, lat, lng, address, userId });

    // ✅ Upload file to Supabase (if exists)
    if (req.file) {
      console.log("File received:", req.file.originalname);

      const fileName = `complaints/${complaintId}_${req.file.originalname}`;
      console.log("Uploading file to Supabase with name:", fileName);

      const { data, error: uploadError } = await supabase.storage
        .from("complaints")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase upload failed:", uploadError);
        return res.status(500).json({ message: "Supabase upload failed", details: uploadError });
      }

      console.log("Upload successful:", data);

      const { data: publicURLData, error: urlError } = supabase.storage
        .from("complaints")
        .getPublicUrl(fileName);

      if (urlError) {
        console.error("Error getting public URL:", urlError);
        return res.status(500).json({ message: "Failed to get public URL", details: urlError });
      }

      fileURL = publicURLData.publicUrl;
      console.log("File public URL:", fileURL);
    } else {
      console.log("No file attached for this complaint.");
    }

    // ✅ Save to Firestore
    await db.collection("complaints").doc(complaintId).set({
      complaintId,
      userId,
      category,
      description,
      priority,
      visibility,
      location: {
        lat: Number(lat),
        lng: Number(lng),
        address
      },
      fileURL,
      status: "Pending",
      createdAt: new Date().toISOString(),
    });

    console.log("Complaint saved to Firestore ✅", complaintId);

    res.status(201).json({ message: "Complaint submitted successfully", complaintId });
  } catch (error) {
    console.error("Complaint submit error:", error);
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
};

// --------------------- GET ALL COMPLAINTS ---------------------
export const getAllComplaints = async (req, res) => {
  try {
    const snapshot = await db.collection("complaints").orderBy("createdAt", "desc").get();
    const complaints = snapshot.docs.map(doc => doc.data());
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
