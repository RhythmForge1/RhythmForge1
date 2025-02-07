const mongoose = require("mongoose");

const escalationSchema = new mongoose.Schema({
    projectId: { type: String, required: true },
    reason: { type: String, required: true },
    expectedTimeslot: { type: Date, required: true }, // Make sure this field is expected to be a Date
    severity: { type: String, required: true },
    usersAffected: { type: Number, required: true },
    attachments: { type: Array, default: [] },
});

const Escalation = mongoose.model("Escalation", escalationSchema);
module.exports = Escalation;
