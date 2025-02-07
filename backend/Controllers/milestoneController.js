const User = require("../models/User");
const Milestone = require("../models/milestoneModel");
const Project = require("../models/projectModel")

const determineUserLevel = (milestoneCount) => {
    // Define levels based on milestone count
    if (milestoneCount >= 4) return "SME"; // 4 milestones => SME
    if (milestoneCount === 3) return "Expert"; // 3 milestones => Expert
    if (milestoneCount === 1) return "Intermediate"; // 1 milestone => Intermediate
    return "Beginner"; // Default Level is Beginner
};
const calculateRewardPoints = (timelyCompletionsCount) => {
    // Define reward points logic
    if (timelyCompletionsCount === 1) return 100;
    return 100 + (timelyCompletionsCount - 1) * 50; // Add 50 points for each additional completion
};
exports.createMilestone = async (req, res) => {
    try {
        // Ensure the request body matches the required fields in the model
        const { title, description, criteria, targetValue, rewardPoints, badge, levelUp, cycle } = req.body;

        if (!cycle || !["JFM", "AMJ", "JAS", "OND"].includes(cycle)) {
            return res.status(400).json({ message: "Invalid cycle. Choose from JFM, AMJ, JAS, OND." });
          }
      
        // Create a new milestone with the correct fields
        const milestone = new Milestone({
            title,          // Match with the schema field name
            description,    // Match with the schema field name
            criteria,       // Match with the schema field name
            targetValue,    // Match with the schema field name
            rewardPoints,
            badge,
            levelUp,
            cycle,
        });
        // Save the milestone to the database
        await milestone.save();
        // Respond with success
        res.status(201).json({ message: "Milestone created!", milestone });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.completeMilestone = async (req, res) => {
    try {
        const { userId, milestoneId, timelyCompletionsCount } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const milestone = await Milestone.findById(milestoneId);
        if (!milestone) return res.status(404).json({ message: "Milestone not found" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.milestonesCompleted.includes(milestoneId)) {
            return res.status(400).json({ message: "Milestone already completed" });
        }

        // Calculate reward points based on timely completions count
        const rewardPoints = calculateRewardPoints(timelyCompletionsCount);

        // Calculate the level based on number of completed milestones
        const updatedLevel = determineUserLevel(user.milestonesCompleted.length + 1);

        // Update user with the completed milestone, badges, points, level, and timelyCompletionsCount
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $addToSet: { milestonesCompleted: milestoneId, badges: milestone.badge || [] },
                $inc: { totalPoints: rewardPoints },
                $set: {
                    level: updatedLevel,
                    timelyCompletionsCount: timelyCompletionsCount
                }
            },
            { new: true }
        );
        let response = {
            message: "Milestone completed!",
            user: updatedUser,
            awardedMilestone: milestoneId,
            timelyCompletionsCount: updatedUser.timelyCompletionsCount,
            badges: updatedUser.badges || [], // Include badges in the response
            currentCycleVoucher: updatedUser.currentCycleVoucher || "In Progress" // Show progress until voucher is generated
        };

        console.log("Milestones Completed Count:", updatedUser.milestonesCompleted.length);

        // **Check if all 4 milestones are completed, then generate a voucher**
        if (updatedUser.milestonesCompleted.length === 4) {
            const generatedVoucher = {
                code: "REWARD-50",
                discount: "50%",
                validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)) // 3 months validity
            };

            console.log("Generated Voucher:", generatedVoucher);

            // Save the current cycle voucher as the previous one
            updatedUser.previousVouchers.push({
                code: updatedUser.currentCycleVoucher.code,
                discount: updatedUser.currentCycleVoucher.discount,
                validUntil: updatedUser.currentCycleVoucher.validUntil
            });

            // Set the new voucher as current cycle voucher
            updatedUser.currentCycleVoucher = generatedVoucher;

            // Reset milestones and timely completions count
            updatedUser.milestonesCompleted = [];
            updatedUser.timelyCompletionsCount = 0;

            // Save the updated user after resetting milestones and generating the voucher
            await updatedUser.save();

            response.currentCycleVoucher = generatedVoucher; // Include the generated voucher in the response
        } else if (updatedUser.milestonesCompleted.length < 4) {
            response.message = "Your Current Cycle Voucher will be generated upon completion of 4 milestones";
            response.currentCycleVoucher = "In Progress"; // Indicating the voucher is still in progress
        }

        // Add message for previous vouchers if they don't exist
        if (updatedUser.previousVouchers.length === 0) {
            response.previousVouchersMessage = "All your Previous vouchers will be displayed here";
        } else {
            response.previousVouchers = updatedUser.previousVouchers; // Include the previous vouchers
        }

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Fetch milestones based on cycle
exports.getMilestonesByCycle = async (req, res) => {
    try {
      const { cycle } = req.params;
  
      if (!["JFM", "AMJ", "JAS", "OND"].includes(cycle)) {
        return res.status(400).json({ message: "Invalid cycle provided." });
      }
  
      const milestones = await Milestone.find({ cycle });
      res.status(200).json({ milestones });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };