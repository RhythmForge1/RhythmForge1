const User = require("../models/User");

exports.getLeaderboard = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default to top 10
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const skip = (page - 1) * limit;

        const leaderboard = await User.find()
            .sort({ totalPoints: -1 })
            .skip(skip)
            .limit(limit)
            .select("name totalPoints level badges")
            .lean(); // Converts Mongoose documents to plain JSON

        // Assign ranks based on sorted order
        leaderboard.forEach((user, index) => {
            user.rank = skip + index + 1;
        });

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
