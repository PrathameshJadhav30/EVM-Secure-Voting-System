const catchAsync = require("../../utils/catchAsync");
const candidateService = require("./candidate.service");

const addCandidate = catchAsync(async (req, res) => {
  const candidate = await candidateService.addCandidate(req.validated.body);
  res.status(201).json({ success: true, message: "Candidate created", data: candidate });
});

const updateCandidate = catchAsync(async (req, res) => {
  const candidate = await candidateService.updateCandidate(req.params.id, req.validated.body);
  res.status(200).json({ success: true, message: "Candidate updated", data: candidate });
});

const deleteCandidate = catchAsync(async (req, res) => {
  await candidateService.deleteCandidate(req.params.id);
  res.status(200).json({ success: true, message: "Candidate deleted" });
});

const getCandidates = catchAsync(async (_req, res) => {
  const candidates = await candidateService.getCandidates();
  res.status(200).json({ success: true, data: candidates });
});

const getCandidateById = catchAsync(async (req, res) => {
  const candidate = await candidateService.getCandidateById(req.params.id);
  res.status(200).json({ success: true, data: candidate });
});

module.exports = {
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidates,
  getCandidateById,
};
