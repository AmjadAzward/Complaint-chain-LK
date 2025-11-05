// controllers/authorityController.js

import { db } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import { supabase } from "../config/supabaseClient.js";
import bcrypt from "bcryptjs"; // For password hashing

// Multer setup for file upload (photo)
export const uploadAuthorityPhoto = multer({ storage: multer.memoryStorage() }).single("photo");

// --------------------- ADD AUTHORITY ---------------------
export const addAuthority = async (req, res) => {
  try {
    const { firstName, lastName, email, department, phone, password } = req.body;

    if (!firstName || !lastName || !email || !department || !password) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // ✅ Check if email already exists
    const existingSnapshot = await db
      .collection("authorities")
      .where("email", "==", email)
      .get();

    if (!existingSnapshot.empty) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const userId = uuidv4();
    let photoURL = null;

    // ✅ Upload photo to Supabase (if exists)
    if (req.file) {
      const fileName = `authorityPhotos/${userId}_${req.file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from("profiles")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase.storage
        .from("profiles")
        .getPublicUrl(fileName);

      photoURL = publicURLData.publicUrl;
    }

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save to Firestore
    await db.collection("authorities").doc(userId).set({
      userId,
      firstName,
      lastName,
      email,
      department, // from combo box in frontend
      phone,
      password: hashedPassword,
      photoURL,
      role: "authority",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Authority added successfully", userId });
  } catch (error) {
    console.error("Add authority error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------- GET ALL AUTHORITIES ---------------------
export const getAllAuthorities = async (req, res) => {
  try {
    const snapshot = await db.collection("authorities").orderBy("createdAt", "desc").get();
    const authorities = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(authorities);
  } catch (error) {
    console.error("Error fetching authorities:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------- UPDATE AUTHORITY ---------------------
export const updateAuthority = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // ✅ If password is being updated, hash it again
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    await db.collection("authorities").doc(id).update({
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });

    res.status(200).json({ message: "Authority updated successfully" });
  } catch (error) {
    console.error("Error updating authority:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------- DELETE AUTHORITY ---------------------
export const deleteAuthority = async (req, res) => {
  try {
    const { email } = req.params;
    const snapshot = await db.collection("authorities").where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "Authority not found" });
    }

    const docId = snapshot.docs[0].id;
    await db.collection("authorities").doc(docId).delete();

    res.status(200).json({ message: "Authority deleted successfully" });
  } catch (error) {
    console.error("Error deleting authority:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
