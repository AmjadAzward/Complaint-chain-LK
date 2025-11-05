// routes/complaintRoutes.js

import express from "express";
import { submitComplaint, uploadComplaintFile , getAllComplaints} from "../controllers/complaintController.js";

const router = express.Router();

router.post("/submit", uploadComplaintFile, submitComplaint);
router.get("/", getAllComplaints); // <-- This is what the React app calls

export default router;
