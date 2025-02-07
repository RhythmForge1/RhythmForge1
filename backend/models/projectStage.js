const mongoose = require("mongoose");

// Define schema for each stage
const stageSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In-progress", "Completed"], required: true },
});

// Define schema for project stages
const projectStageSchema = new mongoose.Schema({
  projectCode: { type: String, required: true, unique: true },
  stages: [stageSchema], // Array of stages
});

module.exports = mongoose.model("ProjectStage", projectStageSchema);
