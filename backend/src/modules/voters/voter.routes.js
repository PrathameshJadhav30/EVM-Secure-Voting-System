const express = require("express");
const { authenticate, authorize } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const voterController = require("./voter.controller");
const { idParamSchema, updateVoterSchema } = require("./voter.validator");

const router = express.Router();

router.use(authenticate);

router.get("/", authorize("ADMIN"), voterController.getAllVoters);
router.get("/:id", validate(idParamSchema), voterController.getVoterById);
router.put("/:id", validate(updateVoterSchema), voterController.updateVoter);
router.delete("/:id", authorize("ADMIN"), validate(idParamSchema), voterController.deleteVoter);

module.exports = router;
