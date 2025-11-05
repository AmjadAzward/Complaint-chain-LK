import { db, storage } from "../config/firebase.js"; // Firebase Admin setup
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js"; // Supabase Storage

// --------------------- LOGIN CITIZEN ---------------------

export const loginCitizen = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    // ✅ 1. Hardcoded admin fallback (ignores DB check)
    if (email === "admin@gmail.com" && password === "admin123") {
      const token = jwt.sign(
        { userId: "admin-default", email: email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        user: {
          userId: "admin-default",
          email: email,
          role: "admin",
          name: "Administrator",
        },
      });
    }

    // ✅ 2. Normal DB-based login for regular users
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { userId: user.userId, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Multer setup for in-memory storage
export const upload = multer({ storage: multer.memoryStorage() });

// --------------------- SIGNUP CITIZEN ---------------------
export const signupCitizen = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    await usersRef.doc(userId).set({
      userId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "citizen",
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ message: "Citizen account created", userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// --------------------- CHECK EMAIL AVAILABILITY ---------------------
export const checkEmailAvailability = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ available: false, message: "Email is required" });

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.json({ available: true });
    } else {
      return res.json({ available: false, message: "Email already taken" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ available: false, message: "Server error" });
  }
};

// --------------------- UPDATE CITIZEN PROFILE ---------------------
export const updateCitizenProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      firstName,
      lastName,
      nic,
      gender,
      email,
      street,
      city,
      postalCode,
      password,
      confirmPassword,
      phone,
    } = req.body;

    // ----------------- Basic Validations -----------------
    if (!firstName || !lastName || !nic || !email || !street || !city || !postalCode || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Email format check
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ message: "Invalid email format" });

    // NIC format (Sri Lankan NIC: old 9+V/X or new 12 digits)
    const nicRegex = /^(\d{9}[VvXx]|\d{12})$/;
    if (!nicRegex.test(nic)) return res.status(400).json({ message: "Invalid NIC format" });

    // Phone number check
    const phoneRegex = /^\+?\d{7,15}$/;
    if (!phoneRegex.test(phone)) return res.status(400).json({ message: "Invalid phone number" });

    // ----------------- Firestore reference -----------------
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ message: "User not found" });

    // ----------------- Uniqueness checks -----------------
    const emailSnapshot = await db.collection("users").where("email", "==", email).get();
    if (!emailSnapshot.empty && emailSnapshot.docs[0].id !== userId) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const nicSnapshot = await db.collection("users").where("nic", "==", nic).get();
    if (!nicSnapshot.empty && nicSnapshot.docs[0].id !== userId) {
      return res.status(400).json({ message: "NIC already exists" });
    }

    const phoneSnapshot = await db.collection("users").where("phone", "==", phone).get();
    if (!phoneSnapshot.empty && phoneSnapshot.docs[0].id !== userId) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // ----------------- Prepare update data -----------------
    const updateData = {
      firstName,
      lastName,
      nic,
      gender,
      email,
      street,
      city,
      postalCode,
      phone,
      updatedAt: new Date().toISOString(),
    };

    // ----------------- Hash password if provided -----------------
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // ----------------- Supabase photo upload -----------------
    if (req.file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: "Invalid file type. Only JPG and PNG are allowed." });
      }

      // Validate file size (< 2MB)
      if (req.file.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: "File too large. Maximum size is 2MB." });
      }

      try {
        const fileName = `profilePhotos/${userId}_${uuidv4()}.jpg`;
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

        updateData.photoURL = publicURLData.publicUrl;
      } catch (err) {
        console.error("Supabase upload failed:", err.message);
        return res.status(500).json({ message: "Failed to upload profile photo" });
      }
    }

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    await userRef.update(updateData);

    res.json({
      message: "Profile updated successfully",
      photoURL: updateData.photoURL || null,
    });
  } catch (error) {
    console.error("Update Citizen Profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




// --------------------- GET CITIZEN BY ID ---------------------
export const getCitizenById = async (req, res) => {
  try {
    const { userId } = req.params;
    const doc = await db.collection("users").doc(userId).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyCitizenPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;
    const doc = await db.collection("users").doc(userId).get();
    if (!doc.exists) return res.status(404).json({ ok: false });

    const user = doc.data();
    const match = await bcrypt.compare(password, user.password);
    return res.json({ ok: match });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
};


export const changeCitizenPassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword, confirmPassword } = req.body;

    // Check if all required fields are provided
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // Get user from Firestore
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userDoc.data();

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    await userRef.update({
      password: hashedPassword,
      updatedAt: new Date().toISOString(),
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// --------------------- GET CITIZEN NAME BY ID ---------------------
export const getCitizenNameById = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userDoc.data();
    const fullName = `${user.firstName} ${user.lastName}`;

    res.status(200).json({ userId, fullName });
  } catch (error) {
    console.error("Error fetching user name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// --------------------- GET ALL CITIZENS ---------------------
export const getAllCitizens = async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    console.log("Documents found:", snapshot.size); // <--- ADD THIS

    if (snapshot.empty) {
      return res.status(404).json({ message: "No citizens found", data: [] });
    }

    const citizens = snapshot.docs.map((doc) => doc.data());
    res.status(200).json({ message: "Citizens retrieved successfully", data: citizens });
  } catch (error) {
    console.error("Get all citizens error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
