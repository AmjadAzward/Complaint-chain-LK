import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import citizenRoutes from './routes/citizen.js';
import complaintRoutes from "./routes/complaint.js";
import yoloRoutes from "./routes/yolo.js";
import commentRoutes from "./routes/commentRoutes.js";
import aiRoutes from "./routes/ai.js";

import authorityRoutes from "./routes/authorityRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/citizen", citizenRoutes);
app.use("/api/complaints", complaintRoutes); // so `/api/complaints/submit` works
app.use("/api/yolo", yoloRoutes);  // <-- prefix for YOLO routes
app.use("/api/comments", commentRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/authorities", authorityRoutes);

app.get("/", (req, res) => {
  res.send("Complaint ChainLK Backend is Running ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

