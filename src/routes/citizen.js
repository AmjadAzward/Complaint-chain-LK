import express from "express";
import {
  signupCitizen,
  loginCitizen,
  updateCitizenProfile,
  getCitizenById,
  getAllCitizens,
  getCitizenNameById,
  verifyCitizenPassword,
  changeCitizenPassword,
  checkEmailAvailability,
  upload
} from "../controllers/citizenController.js";

const router = express.Router();

// Citizen routes
router.post("/signup", signupCitizen);
router.post("/login", loginCitizen);
router.get("/", getAllCitizens);
router.get("/:userId", getCitizenById);
router.put("/update/:userId", upload.single("photo"), updateCitizenProfile);
router.post("/check-email", checkEmailAvailability);
router.post("/verify-password", verifyCitizenPassword);
router.post("/change-password", changeCitizenPassword);
router.get("/name/:userId", getCitizenNameById);


export default router;
