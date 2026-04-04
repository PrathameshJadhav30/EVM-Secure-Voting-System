const express = require("express");
const { authenticate, authorize } = require("../../middleware/auth.middleware");
const validate = require("../../middleware/validate.middleware");
const candidateController = require("./candidate.controller");
const { createCandidateSchema, updateCandidateSchema, idParamSchema } = require("./candidate.validator");

const router = express.Router();

router.get("/", candidateController.getCandidates);
router.get("/:id", validate(idParamSchema), candidateController.getCandidateById);

router.post("/", authenticate, authorize("ADMIN"), validate(createCandidateSchema), candidateController.addCandidate);
router.put("/:id", authenticate, authorize("ADMIN"), validate(updateCandidateSchema), candidateController.updateCandidate);
router.delete("/:id", authenticate, authorize("ADMIN"), validate(idParamSchema), candidateController.deleteCandidate);

module.exports = router;
