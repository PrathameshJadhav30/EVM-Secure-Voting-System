const catchAsync = require("../../utils/catchAsync");
const voterService = require("./voter.service");

const getAllVoters = catchAsync(async (_req, res) => {
  const voters = await voterService.getAllVoters();
  res.status(200).json({ success: true, data: voters });
});

const getVoterById = catchAsync(async (req, res) => {
  const voter = await voterService.getVoterById(req.params.id, req.user);
  res.status(200).json({ success: true, data: voter });
});

const updateVoter = catchAsync(async (req, res) => {
  const voter = await voterService.updateVoter(req.params.id, req.validated.body, req.user);
  res.status(200).json({ success: true, message: "Voter updated", data: voter });
});

const deleteVoter = catchAsync(async (req, res) => {
  await voterService.deleteVoter(req.params.id);
  res.status(200).json({ success: true, message: "Voter deleted" });
});

module.exports = {
  getAllVoters,
  getVoterById,
  updateVoter,
  deleteVoter,
};
