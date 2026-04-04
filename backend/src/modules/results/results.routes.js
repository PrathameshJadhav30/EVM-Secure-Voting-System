const express = require("express");
const resultsController = require("./results.controller");

const router = express.Router();

router.get("/", resultsController.getResults);
router.get("/winner", resultsController.getWinner);

module.exports = router;
