const express = require("express");

const authRoutes = require("../modules/auth/auth.routes");
const voterRoutes = require("../modules/voters/voter.routes");
const candidateRoutes = require("../modules/candidates/candidate.routes");
const electionRoutes = require("../modules/election/election.routes");
const voteRoutes = require("../modules/votes/vote.routes");
const resultsRoutes = require("../modules/results/results.routes");
const adminRoutes = require("../modules/admin/admin.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/voters", voterRoutes);
router.use("/candidates", candidateRoutes);
router.use("/elections", electionRoutes);
router.use("/vote", voteRoutes);
router.use("/results", resultsRoutes);
router.use("/admin", adminRoutes);

module.exports = router;
