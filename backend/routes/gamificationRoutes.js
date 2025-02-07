const express = require("express");
const router = express.Router();

const leaderboardController = require("../Controllers/leaderboardController");
const milestoneController = require("../Controllers/milestoneController");

// router.patch("/milestones/complete", milestoneController.completeMilestone);
router.post("/milestones/create", milestoneController.createMilestone);
router.patch("/:milestoneId/complete", milestoneController.completeMilestone);
router.get("/cycle/:cycle", milestoneController.getMilestonesByCycle);
router.get("/leaderboard", leaderboardController.getLeaderboard);

module.exports = router;
