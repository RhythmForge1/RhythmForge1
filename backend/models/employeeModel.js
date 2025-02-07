const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true }, // e.g., Developer, QA, Manager
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // References to teams
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], // References to projects
  milestonesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Milestone" }] 
});

module.exports = mongoose.model("Employee", employeeSchema);