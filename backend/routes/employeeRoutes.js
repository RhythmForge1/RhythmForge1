const express = require("express");
const router = express.Router();
const EmployeeController = require("../Controllers/EmployeeController");

// Create a new employee
router.post("/create", EmployeeController.createMember); 



// Assign an employee to teams and projects
router.patch("/:employeeId/assign", EmployeeController.assignToTeamsAndProjects);

// Fetch all employees
// router.get("/", EmployeeController.getAllEmployees);
router.get("/", EmployeeController.getAllMembers);
// Fetch a single employee by ID
router.get("/:employeeId", EmployeeController.getEmployeeById);

//one for all
router.patch('/update-project/:projectCode', EmployeeController.updateProjectDetails);

module.exports = router;
