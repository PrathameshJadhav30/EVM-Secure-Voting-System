const catchAsync = require("../../utils/catchAsync");
const resultsService = require("./results.service");

const getResults = catchAsync(async (_req, res) => {
  const data = await resultsService.getResults();
  res.status(200).json({ success: true, data });
});

const getWinner = catchAsync(async (_req, res) => {
  const data = await resultsService.getWinner();
  res.status(200).json({ success: true, data });
});

module.exports = {
  getResults,
  getWinner,
};
