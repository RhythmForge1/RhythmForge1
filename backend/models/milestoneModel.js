const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    name: String,
    email: String,
    totalPoints: { type: Number, default: 0 },
    milestonesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Milestone" }],
    badge: [String],
    level: { type: String, default: "Beginner" },
    timelyCompletionsCount: { type: Number, default: 0 } ,
    cycle: { type: String, enum: ["JFM", "AMJ", "JAS", "OND"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Milestone", milestoneSchema);
