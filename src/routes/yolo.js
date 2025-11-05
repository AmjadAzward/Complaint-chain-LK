import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/detect", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  const tempDir = path.join(process.cwd(), "temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const tempPath = path.join(tempDir, `${Date.now()}-${req.file.originalname}`);
  fs.writeFileSync(tempPath, req.file.buffer);

  const python = spawn("python", ["yolo_detect.py", tempPath]);

  let dataString = "";
  let errorString = "";

  python.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorString += data.toString();
    console.error("YOLO error:", data.toString());
  });

  python.on("close", (code) => {
    fs.unlink(tempPath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });

    if (code !== 0) {
      return res.status(500).json({
        error: "YOLO detection failed",
        code,
        details: errorString || dataString,
      });
    }

    try {
      const jsonLine = dataString.trim().split('\n').pop(); // ✅ ONLY final line
      const detectedObjects = JSON.parse(jsonLine);
      return res.json(detectedObjects); // ✅ Expected format: { objects: [...] }
    } catch (err) {
      return res.status(500).json({
        error: "Failed to parse YOLO output",
        details: dataString,
      });
    }
  });
});

export default router;
