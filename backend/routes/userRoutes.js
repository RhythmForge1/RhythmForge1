const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');

// Routes for User
router.post('/users', (req, res) => {
    console.log('POST /api/users route hit');
    UserController.createUser(req, res);
});
// router.post('/users', UserController.createUser);  // Create user
router.get('/users/profile', UserController.getUserProfile);  // Get user profile
router.put('/users/:userId/assign', UserController.assignToTeamsAndProjects);  // Assign user to teams/projects
router.get('/users', UserController.getAllUsers);  // Get all users

module.exports = router;
