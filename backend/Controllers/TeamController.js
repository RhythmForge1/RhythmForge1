const Team = require('../models/teamModel');

// Add a new team
exports.addTeam = async (req, res) => {
  try {
    const { name, projectCode, size, projectsInProgress, projectsClosed, valueAdds, escalations } = req.body;

    // Check if team already exists
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team with this name already exists' });
    }

    const newTeam = new Team({ name, projectCode, size, projectsInProgress, projectsClosed, valueAdds, escalations });
    await newTeam.save();

    res.status(201).json({ message: 'Team added successfully', team: newTeam });
  } catch (error) {
    res.status(500).json({ message: 'Error adding team', error: error.message });
  }
};

// Fetch all teams
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teams', error: error.message });
  }
};
