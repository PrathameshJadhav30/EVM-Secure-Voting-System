const catchAsync = require("../../utils/catchAsync");
const voteService = require("./vote.service");

const castVote = catchAsync(async (req, res) => {
  const vote = await voteService.castVote({
    voterId: req.user.id,
    candidateId: req.validated.body.candidateId,
  });

  res.status(201).json({
    success: true,
    message: "Vote cast successfully",
    data: {
      id: vote.id,
      voterId: vote.voterId,
      candidateId: vote.candidateId,
      electionId: vote.electionId,
      createdAt: vote.createdAt,
    },
  });
});

module.exports = {
  castVote,
};
