const express = require("express");
const { authenticate, authorize } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const electionController = require("./election.controller");
const { createElectionSchema, electionIdBodySchema } = require("./election.validator");

const router = express.Router();

router.get("/current", electionController.getCurrentElection);

router.post("/", authenticate, authorize("ADMIN"), validate(createElectionSchema), electionController.createElection);
router.put("/start", authenticate, authorize("ADMIN"), validate(electionIdBodySchema), electionController.startElection);
router.put("/end", authenticate, authorize("ADMIN"), validate(electionIdBodySchema), electionController.endElection);

module.exports = router;
