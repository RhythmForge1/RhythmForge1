const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    projectCode: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        required: true,
        enum: ['Internal', 'Vendor'], // Restrict the userType to only "Internal" or "Vendor"
    },
    lineManagerEmail: {
        type: String,
        required: true,
        unique: true,
    },
    sapId: {
        type: String,
        required: function () {
            return this.userType === 'Internal';
        }, // Only required if userType is 'Internal'
    },
    businessJustification: {
        type: String,
        required: function () {
            return this.userType === 'Internal';
        }, // Only required if userType is 'Internal'
    },
    role: {
        type: String,
        required: true,
    },
    accessType: {
        type: String,
        required: true,
    },

    // Milestone & Rewards
    totalPoints: { type: Number, default: 0 }, // Total earned points
    level: { 
        type: String, 
        enum: ["Beginner", "Intermediate", "Advanced", "Expert", "SME"], 
        default: "Beginner" 
    },// User Level
    badges: [String], // List of earned badges
    milestonesCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: "Milestone" }], // Completed Milestones
    timelyCompletionsCount: { type: Number, default: 0 }, 
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: "Team" }], // References to teams
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }], // References to projects
    previousVouchers: [
        {
            code: { type: String },
            discount: { type: String },
            validUntil: { type: Date }
        }],
    currentCycleVoucher: {
        code: { type: String },
        discount: { type: String },
        validUntil: { type: Date }
    },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
