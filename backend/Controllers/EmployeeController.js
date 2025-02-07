const Employee = require("../models/employeeModel");
const Team = require("../models/teamModel");
const Project = require("../models/projectModel");
const User = require("../models/User");
const mongoose = require("mongoose");

// Create a new employee trying 1
// exports.createEmployee = async (req, res) => {
//   const { name, email, role } = req.body;

//   if (!name || !email || !role) {
//     return res.status(400).json({ message: "All fields are required." });
//   }

//   try {
//     const newEmployee = new Employee({ name, email, role });
//     await newEmployee.save();
//     res.status(201).json({ message: "Employee created successfully.", employee: newEmployee });
//   } catch (error) {
//     console.error("Error creating employee:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
// Create a new member
exports.createMember = async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newMember = new Employee({ name, email, role });  // Changed to Member
    await newMember.save();
    res.status(201).json({ message: "Member created successfully.", member: newMember });  // Changed to member
  } catch (error) {
    console.error("Error creating member:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Assign an employee to teams and projects
exports.assignToTeamsAndProjects = async (req, res) => {
  const { employeeId } = req.params;
  const { teams, projects } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Update teams and projects
    if (teams) {
      employee.teams = [...new Set([...employee.teams, ...teams])];
      await Team.updateMany({ _id: { $in: teams } }, { $addToSet: { employees: employeeId } });
    }

    if (projects) {
      employee.projects = [...new Set([...employee.projects, ...projects])];
      await Project.updateMany({ _id: { $in: projects } }, { $addToSet: { members: employeeId } });
    }

    await employee.save();
    res.status(200).json({ message: "Employee assigned to teams/projects successfully.", employee });
  } catch (error) {
    console.error("Error assigning employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all employees trying 1
// exports.getAllEmployees = async (req, res) => {
//   try {
//     const employees = await Employee.find().populate("teams projects", "name projectCode");
//     res.status(200).json(employees);
//   } catch (error) {
//     console.error("Error fetching employees:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
exports.getAllMembers = async (req, res) => {
  try {
    // Fetch employees
    const employees = await Employee.find().populate("teams projects", "name projectCode");

    // Fetch users
    const users = await User.find().populate("milestonesCompleted", "title description rewardPoints badge");

    // Function to deduplicate arrays based on the 'name' or 'projectCode'
    const deduplicateArray = (array, key) => {
      const seen = new Set();
      return array.filter(item => {
        const identifier = item[key];
        return seen.has(identifier) ? false : seen.add(identifier);
      });
    };

    // Combine both results into a single response
    const members = [
      ...employees.map(emp => ({
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        role: emp.role,
        type: "Employee",
        teams: deduplicateArray(emp.teams, 'name'),  // Deduplicate teams by 'name'
        projects: deduplicateArray(emp.projects, 'projectCode')  // Deduplicate projects by 'projectCode'
      })),
      ...users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        type: "User",
        projectCode: user.projectCode || [],
        totalPoints: user.totalPoints || 0,
        level: user.level || "Beginner",
        badges: user.badges || [],
        milestonesCompleted: user.milestonesCompleted || []
      }))
    ];

    res.status(200).json({ members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Fetch a single employee by ID
exports.getEmployeeById = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findById(new mongoose.Types.ObjectId(employeeId)).populate("teams projects", "name projectCode");
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    console.log("Fetching user with email:", employee.email);

    const user = await User.findOne({ email: employee.email }).populate("milestonesCompleted", "title description rewardPoints badge");

    if (!user) {
      console.log("User profile not found for email:", employee.email);
      return res.status(404).json({ message: "User profile not found." });
    }

    res.status(200).json({
      employee,
      userProfile: {
        totalPoints: user.totalPoints,
        level: user.level,
        badges: user.badges,
        milestonesCompleted: user.milestonesCompleted,
      },
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Fetch members of a specific project
exports.getProjectMembers = async (req, res) => {
  const { projectCode } = req.params;

  try {
    const project = await Project.findOne({ projectCode }).populate("members", "name email role");
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.status(200).json({ members: project.members });
  } catch (error) {
    console.error("Error fetching project members:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Unified API for updating project details
exports.updateProjectDetails = async (req, res) => {
  const { projectCode } = req.params;
  const { stage, status, startDate, endDate, severity, detailedDescription, members, teams } = req.body;

  try {
    // Find the project by projectCode
    const project = await Project.findOne({ projectCode });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Update severity, description, and other fields if provided
    if (severity) project.severity = severity;
    if (detailedDescription) project.detailedDescription = detailedDescription;

    // Update members
    if (members && members.length > 0) {
      project.members = [...new Set([...project.members, ...members])]; // Avoid duplicates
    }

    // Update teams
    if (teams && teams.length > 0) {
      if (!Array.isArray(project.teams)) {
        project.teams = [];
      }
      project.teams = [...new Set([...project.teams, ...teams])]; // Avoid duplicates

      // Optionally update each team in the database
      for (const teamId of teams) {
        await Team.findByIdAndUpdate(teamId, { $addToSet: { projects: project._id } });
      }
    }

    // Update a specific stage if provided
    if (stage) {
      const stageIndex = project.stages.findIndex((stg) => stg.stage === stage);

      if (stageIndex !== -1) {
        // Update existing stage
        project.stages[stageIndex].status = status || project.stages[stageIndex].status;
        project.stages[stageIndex].startDate = startDate || project.stages[stageIndex].startDate;
        project.stages[stageIndex].endDate = endDate || project.stages[stageIndex].endDate;
      } else {
        // Add new stage if it doesn't exist
        project.stages.push({ stage, status, startDate, endDate });
      }
    }

    // Save the updated project
    await project.save();

    return res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
