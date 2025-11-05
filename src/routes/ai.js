import express from "express";
import OpenAI from "openai";

const router = express.Router();

// Initialize OpenAI with your secret key from .env
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/ai/assist
router.post("/assist", async (req, res) => {
  const { complaintData } = req.body;
  if (!complaintData) {
    return res.status(400).json({ error: "Complaint data is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `Summarize: ${JSON.stringify(complaintData)}` }
      ],
      temperature: 0.7,
    });

    res.json({ aiMessage: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API Error:", error); // ← log full error
    res.status(500).json({ error: error.message || "Server error" });
  }
});


export default router;
