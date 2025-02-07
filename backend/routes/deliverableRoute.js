const express = require("express");
const router = express.Router();
const Project = require("../models/projectModel"); // Ensure the path is correct
const users = require("../models/User.js");

// Fetch deliverables for all projects
router.get("/", async (req, res) => {
  try {
    // Retrieve all projects and populate 'members' with name, email, and _id
    const projects = await Project.find()
      .populate("members", "name email _id")  // Ensure name is being populated

    console.log("Fetched projects with populated members:", projects);

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found." });
    }

    const allDeliverables = projects.map((project) =>
      project.stages.map((stage) => ({
        projectCode: project.projectCode,
        stage: stage.stage,
        status: stage.status,
        startDate: stage.startDate,
        endDate: stage.endDate,
        actualStartDate: stage.actualStartDate || "Not Available",
        actualEndDate: stage.actualEndDate || "Not Available",
        teamMembers: project.members.map((member) => ({
          name: member.name || "Name Not Available",  // Fallback if name is undefined
          userdId: member._id,
        })),
        severity: project.severity,
      }))
    ).flat();

    res.status(200).json({ deliverables: allDeliverables });
  } catch (error) {
    console.error("Error fetching deliverables:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
// Fetch deliverables for a specific projectCode
router.get("/:projectCode", async (req, res) => {
  try {
    const { projectCode } = req.params;
    const project = await Project.findOne({ projectCode }).populate("members", "name email _id");


    // If project is not found
    if (!project) {
      return res.status(404).json({ message: `Project with code ${projectCode} not found.` });
    }

    // Map deliverables for the project
    const deliverables = project.stages.map((stage) => ({
      projectCode: project.projectCode,
      stage: stage.stage,
      status: stage.status,
      startDate: stage.startDate,
      endDate: stage.endDate,
      actualStartDate: stage.actualStartDate || "Not Available",
      actualEndDate: stage.actualEndDate || "Not Available",
      teamMembers: project.members.map((member) => ({
        name: member.name || "Name Not Available",
        userId: member._id,  // This is the ObjectId (employeeId)
      })), // Team member names
      severity: project.severity,
      currentAssignee: stage.currentAssignee || null,
    }));

    res.status(200).json({ deliverables });
  } catch (error) {
    console.error("Error fetching deliverables:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
