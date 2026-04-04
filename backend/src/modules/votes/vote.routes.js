const express = require("express");
const { authenticate, authorize } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const voteController = require("./vote.controller");
const { castVoteSchema } = require("./vote.validator");

const router = express.Router();

router.post("/", authenticate, authorize("VOTER"), validate(castVoteSchema), voteController.castVote);

module.exports = router;
