const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  stageName: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Attachment", attachmentSchema);
