const catchAsync = require("../../utils/catchAsync");
const electionService = require("./election.service");

const createElection = catchAsync(async (req, res) => {
  const election = await electionService.createElection(req.validated.body);
  res.status(201).json({ success: true, message: "Election created", data: election });
});

const startElection = catchAsync(async (req, res) => {
  const election = await electionService.activateElection(req.validated.body.electionId);
  res.status(200).json({ success: true, message: "Election started", data: election });
});

const endElection = catchAsync(async (req, res) => {
  const election = await electionService.endElection(req.validated.body.electionId);
  res.status(200).json({ success: true, message: "Election ended", data: election });
});

const getCurrentElection = catchAsync(async (_req, res) => {
  const election = await electionService.getCurrentElection();
  res.status(200).json({ success: true, data: election });
});

module.exports = {
  createElection,
  startElection,
  endElection,
  getCurrentElection,
};
