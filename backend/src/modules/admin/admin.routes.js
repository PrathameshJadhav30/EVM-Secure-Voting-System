const express = require("express");
const { authenticate, authorize } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const { electionIdBodySchema } = require("../election/election.validator");
const adminController = require("./admin.controller");

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/dashboard", adminController.getDashboard);
router.put("/election/start", validate(electionIdBodySchema), adminController.startElection);
router.put("/election/end", validate(electionIdBodySchema), adminController.endElection);

module.exports = router;
