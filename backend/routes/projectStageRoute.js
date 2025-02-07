const express = require("express");
const router = express.Router();
const ProjectStage = require("../models/projectStage");

// List of all stages
const allStages = [
  "Review",
  "Design",
  "Approval",
  "Development",
  "Integration Testing",
  "UAT",
  "Deployed",
  "Closed",
];

// Fetch all project stages
router.get("/", async (req, res) => {
  try {
    const projects = await ProjectStage.find(); // Fetch all project stages
    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found" });
    }
    res.json(projects);
  } catch (error) {
    console.error("Error fetching project stages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch stages for a specific project by projectCode
router.get("/:projectCode", async (req, res) => {
  try {
    const { projectCode } = req.params;
    const project = await ProjectStage.findOne({ projectCode });
    if (!project) {
      return res.status(404).json({ message: "Stages not found for this project" });
    }
    res.json(project);
  } catch (error) {
    console.error("Error fetching stages for project:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add a new project stage
router.post("/", async (req, res) => {
  try {
    const { projectCode, currentStage, nextStage, status } = req.body;

    // Validation
    if (!projectCode || !currentStage || !nextStage || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if projectCode already exists
    const existingProject = await ProjectStage.findOne({ projectCode });
    if (existingProject) {
      return res.status(400).json({ message: "Project already exists" });
    }

    // Create default stages with "Pending" status
    const stages = allStages.map((stage) => ({
      stage,
      status: stage === currentStage ? status : "Pending", // Mark `currentStage` with its given status
    }));

    // Save new project stage in MongoDB
    const newStage = new ProjectStage({
      projectCode,
      stages, // Save the `stages` array
    });

    await newStage.save();

    res.status(201).json({
      message: "Project stages added successfully!",
      projectCode,
      stages,
    });
  } catch (error) {
    console.error("Error adding project stage:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
