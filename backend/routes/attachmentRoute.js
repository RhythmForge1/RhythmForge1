const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Attachment = require("../models/attachmentModel");

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload an attachment
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { projectId, stageName } = req.body;
    const newAttachment = new Attachment({
      projectId,
      stageName,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });

    await newAttachment.save();
    res.status(201).json({ message: "File uploaded successfully", newAttachment });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
});

// Fetch attachments for a specific project
router.get("/:projectId", async (req, res) => {
    try {
      const attachments = await Attachment.find({ projectId: req.params.projectId });
      res.json(attachments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attachments", error });
    }
  });

// Delete an attachment
router.delete("/:id", async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) return res.status(404).json({ message: "Attachment not found" });

    fs.unlinkSync(attachment.filePath);
    await Attachment.findByIdAndDelete(req.params.id);
    res.json({ message: "Attachment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete attachment", error });
  }
});
// Get all attachments
router.get("/", async (req, res) => {
    try {
      const attachments = await Attachment.find();
      res.json(attachments);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
