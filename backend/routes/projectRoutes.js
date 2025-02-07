const express = require("express");
const router = express.Router();
const Project = require("../models/projectModel");

const AuthMiddleware = require("../Middlewares/Auth");

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

// Unified POST: Create a project with default stages
router.post("/create", AuthMiddleware, async (req, res) => {
  const {
    shortDescription,
    detailedDescription,
    area,
    expectedDate,
    mutualBenefits,
    severity,
    lineManagerEmail,
  } = req.body;

  const documents = req.files ? req.files.map((file) => file.path) : [];
  const projectCode = shortDescription.trim().substring(0, 4).toUpperCase();

  // Validate input
  if (!shortDescription || !detailedDescription || !area || !expectedDate || !severity || !lineManagerEmail) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  try {
    const projectCreationDate = new Date(); // Use current date as the base

    // Calculate default stages with startDate and endDate
    const stages = allStages.map((stage, index) => {
      const startDate = new Date(projectCreationDate);
      startDate.setDate(startDate.getDate() + index * 7); // Increment start date by 7 days per stage

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6); // End date is 6 days after start date

      return {
        stage,
        status: "Pending",
        startDate,
        endDate,
      };
    });

    // Create a new project with stages
    const newProject = new Project({
      shortDescription: shortDescription.trim(),
      detailedDescription: detailedDescription.trim(),
      area: area.trim(),
      expectedDate,
      mutualBenefits: mutualBenefits || "",
      severity,
      lineManagerEmail: lineManagerEmail.trim(),
      documents,
      projectCode,
      stages, // Embed stages directly
    });

    await newProject.save();
    res.status(201).json({ project: newProject, message: "Project created successfully with default stages." });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Unified GET: Fetch all projects with stages
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Unified GET: Fetch a single project with stages by projectCode
router.get("/:projectCode", async (req, res) => {
  try {
    const { projectCode } = req.params;

    const project = await Project.findOne({ projectCode });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// GET all project codes
router.get('/projects', async (req, res) => {
  try {
      const projects = await Project.find().select('projectCode'); // Only fetch projectCode
      if (!projects || projects.length === 0) {
          return res.status(404).json({ message: 'Project not found.' });
      }
      res.status(200).json(projects); // Return the project codes
  } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: 'Server error', error });
  }
});
  router.patch("/:projectCode/stages/:stage", AuthMiddleware, async (req, res) => {
    const { projectCode, stage } = req.params;
    const { status } = req.body;
  
    try {
      const project = await Project.findOne({ projectCode });
      if (!project) {
        return res.status(404).json({ message: "Project not found." });
      }
  
    // Find the index of the stage to be updated
    const stageIndex = project.stages.findIndex((s) => s.stage === stage);
    if (stageIndex === -1) {
      return res.status(404).json({ message: "Stage not found in the project." });
    }
  
      if (status) {
        project.stages[stageIndex].status = status;
  
        // If status is "Rejected," cascade update subsequent stages
        if (status === "Rejected") {
          for (let i = stageIndex + 1; i < project.stages.length; i++) {
            project.stages[i].status = "Closed";
          }
        }
  
        // If status is "Completed," update the endDate to the current date
        if (status === "Completed") {
          project.stages[stageIndex].endDate = new Date();
        }
      }
  
      await project.save();
      res.status(200).json({ message: "Stage updated successfully to ${status}.", project });
    } catch (error) {
      console.error("Error updating stage:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

// Fetch deliverables for all projects
router.get("/deliverables", async (req, res) => {
  try {
    // Retrieve all projects and populate members
    const projects = await Project.find().populate("members", "name email");
console.log("Fetched projects:", projects); 
    // Map through the projects and stages to get deliverables
    const allDeliverables = projects.map((project) => 
      project.stages.map((stage) => ({
        projectCode: project.projectCode,
        stage: stage.stage,
        status: stage.status,
        startDate: stage.startDate,
        endDate: stage.endDate,
        actualStartDate: stage.actualStartDate || "Not Available",
        actualEndDate: stage.actualEndDate || "Not Available",
        teamMembers: project.members.map((member) => member.name).join(", "), // Join member names
      }))
    ).flat(); // Flatten the array of deliverables from each project

    res.status(200).json({ deliverables: allDeliverables });
  } catch (error) {
    console.error("Error fetching deliverables:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.patch("/:projectCode/assignee", AuthMiddleware, async (req, res) => {
  const { projectCode } = req.params;
  const { assigneeId } = req.body;

  try {
    const project = await Project.findOne({ projectCode });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    project.assignee = assigneeId; // Assuming an `assignee` field exists in your schema
    await project.save();

    res.status(200).json({ message: "Assignee updated successfully.", project });
  } catch (error) {
    console.error("Error updating assignee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// PATCH route to update start and end dates
router.patch("/:projectCode/stages/:stage/dates", AuthMiddleware, async (req, res) => {
  const { projectCode, stage } = req.params; // Get projectCode and stage from the URL
  const { startDate, endDate } = req.body;  // Get startDate and endDate from the request body

  try {
    const project = await Project.findOne({ projectCode });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Find the index of the stage to update
    const stageIndex = project.stages.findIndex((s) => s.stage === stage);
    if (stageIndex === -1) {
      return res.status(404).json({ message: "Stage not found." });
    }

    // Update the start and end dates of the specified stage
    if (startDate) {
      project.stages[stageIndex].startDate = new Date(startDate);
    }
    if (endDate) {
      project.stages[stageIndex].endDate = new Date(endDate);
    }

    // Save the updated project
    await project.save();

    res.status(200).json({
      message: "Project dates updated successfully for stage: " + stage,
      project,
    });
  } catch (error) {
    console.error("Error updating stage dates:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
router.patch("/:projectCode/update", AuthMiddleware, async (req, res) => {
  const { projectCode } = req.params;
  const { shortDescription, detailedDescription, severity } = req.body;

  try {
    // Find the project by projectCode
    const project = await Project.findOne({ projectCode });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Update only if values are provided
    if (shortDescription) project.shortDescription = shortDescription.trim();
    if (detailedDescription) project.detailedDescription = detailedDescription.trim();
    if (severity) project.severity = severity;

    // Save the updated project
    await project.save();

    res.status(200).json({ message: "Project updated successfully.", project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

exports.assignMembersToProject = async (req, res) => {
  const { projectId } = req.params;
  const { members } = req.body; // members should include both User and Employee IDs

  try {
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    for (const memberId of members) {
      const user = await user.findById(memberId);
      const employee = await employee.findById(memberId);

      if (user || employee) {
        project.members.push(memberId);
      }
    }

    await project.save();
    res.status(200).json({ message: "Members assigned successfully", project });
  } catch (error) {
    console.error("Error assigning members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = router;