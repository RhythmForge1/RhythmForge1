const express = require('express');
const router = express.Router();
const teamController = require('../Controllers/TeamController');

// Routes
router.post('/add-team', teamController.addTeam); // Add a new team
router.get('/get-teams', teamController.getTeams); // Fetch all teams

module.exports = router;