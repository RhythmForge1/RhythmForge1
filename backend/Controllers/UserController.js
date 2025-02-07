const UserModel = require('../models/User');
const jwt = require('jsonwebtoken');
const Team = require('../models/teamModel');
const Project = require('../models/projectModel');
const bcrypt = require('bcrypt');

const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({
                message: "No token provided. Please log in.",
                success: false,
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;

        const user = await UserModel.findById(userId).populate('previousVouchers');
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        res.status(200).json({
            success: true,
            user: {
                name: user.name,
                email: user.email,
                projectCode: user.projectCode,
                userType: user.userType,
                role: user.role,
                accessType: user.accessType,
                lineManagerEmail: user.lineManagerEmail,
                sapId: user.userType === 'Internal' ? user.sapId : null,
                businessJustification: user.userType === 'Internal' ? user.businessJustification : null,
                totalPoints: user.totalPoints,
                level: user.level,
                badge: user.badges,
                milestonesCompleted: user.milestonesCompleted,
                timelyCompletionsCount: user.timelyCompletionsCount,
                previousVouchers: user.previousVouchers,
                currentCycleVoucher: user.currentCycleVoucher

            },
        });
    } catch (err) {
        console.error('Error retrieving user profile:', err);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: err.message,
        });
    }
};

const createUser = async (req, res) => {
    const { name, email, role, userType, lineManagerEmail, sapId, businessJustification, accessType, projectCode, password } = req.body;

    if (!name || !email || !role || !userType || !lineManagerEmail || !projectCode || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const newUser = new UserModel({
            name,
            email,
            role,
            userType,
            lineManagerEmail,
            sapId: userType === 'Internal' ? sapId : undefined,
            businessJustification: userType === 'Internal' ? businessJustification : undefined,
            accessType,
            projectCode,
            password: await bcrypt.hash(password, 10),
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const assignToTeamsAndProjects = async (req, res) => {
    const { userId } = req.params;
    const { teams, projects } = req.body;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (teams) {
            user.teams = [...new Set([...user.teams, ...teams])];
            await Team.updateMany({ _id: { $in: teams } }, { $addToSet: { members: userId } });
        }

        if (projects) {
            user.projects = [...new Set([...user.projects, ...projects])];
            await Project.updateMany({ _id: { $in: projects } }, { $addToSet: { members: userId } });
        }

        await user.save();
        res.status(200).json({ message: "User assigned to teams/projects successfully.", user });
    } catch (error) {
        console.error("Error assigning user:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().populate("teams", "name").populate("projects", "projectCode");

        res.status(200).json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getUserProfile,
    createUser,
    assignToTeamsAndProjects,
    getAllUsers
};
