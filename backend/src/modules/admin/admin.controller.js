const catchAsync = require("../../utils/catchAsync");
const adminService = require("./admin.service");

const getDashboard = catchAsync(async (_req, res) => {
  const data = await adminService.getDashboard();
  res.status(200).json({ success: true, data });
});

const startElection = catchAsync(async (req, res) => {
  const election = await adminService.startElection(req.validated.body.electionId);
  res.status(200).json({ success: true, message: "Election started", data: election });
});

const endElection = catchAsync(async (req, res) => {
  const election = await adminService.endElection(req.validated.body.electionId);
  res.status(200).json({ success: true, message: "Election ended", data: election });
});

module.exports = {
  getDashboard,
  startElection,
  endElection,
};
