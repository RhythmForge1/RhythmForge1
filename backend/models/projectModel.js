const mongoose = require("mongoose");

// Define schema for each stage
const stageSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  status: { type: String, enum: ["Pending", "In-Progress", "Completed", "Rejected", "Closed"], required: true },
  startDate: { type: Date }, // Optional start date
  endDate: { type: Date },   // Optional end date
  currentAssignee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
});

// Define schema for project with embedded stages
const projectSchema = new mongoose.Schema({
  shortDescription: { type: String, required: true },
  detailedDescription: { type: String, required: true },
  area: { type: String, required: true },
  expectedDate: { type: Date, required: true },
  mutualBenefits: { type: String, default: "" },
  severity: { type: String, enum: ["High", "Medium", "Low"], required: true },
  lineManagerEmail: { type: String, required: true },
  documents: { type: [String], default: [] }, // Array of document paths or URLs
  createdAt: { type: Date, default: Date.now },
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  // members: [{ type: mongoose.Schema.Types.ObjectId, refPath: "memberType" }], 
  // memberType: { type: String, enum: ["User", "Employee"] }, // Dynamic reference
  projectCode: {
    type: String,
    required: true
  },
  stages: [stageSchema], // Embed stages directly into the project schema

});

module.exports = mongoose.model("Project", projectSchema);