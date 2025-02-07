const express = require('express');
const router = express.Router();
const Escalation = require('../models/escalationModel'); // Import Mongoose model

// POST route for escalation (Store in DB)
router.post('/escalation', async (req, res) => {
    try {
        const { projectId, reason, expectedTimeslot, severity, usersAffected, attachments } = req.body;

        // Create a new escalation document
        const newEscalation = new Escalation({
            projectId,
            reason,
            expectedTimeslot,
            severity,
            usersAffected,
            attachments,
            status: 'Pending', // Default status
            createdAt: new Date(),
        });

        await newEscalation.save();

        res.status(201).json({ message: 'Escalation submitted successfully!', escalation: newEscalation });
    } catch (error) {
        console.error('Error submitting escalation:', error);
        res.status(500).json({ message: 'Error submitting escalation', error: error.message });
    }
});

// GET route to fetch all escalations
router.get('/escalations', async (req, res) => {
    try {
        const escalations = await Escalation.find().sort({ createdAt: -1 }); // Fetch latest first
        res.status(200).json(escalations);
    } catch (error) {
        console.error('Error fetching escalations:', error);
        res.status(500).json({ message: 'Error fetching escalations', error: error.message });
    }
});

module.exports = router;
