const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const { encrypt } = require("../../utils/crypto");
const electionService = require("../election/election.service");

const castVote = async ({ voterId, candidateId }) => {
  const voter = await prisma.voter.findUnique({ where: { id: voterId } });
  if (!voter) throw new AppError("Voter not found", 404);

  const election = await electionService.getActiveElectionForVoting();

  const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
  if (!candidate) throw new AppError("Candidate not found", 404);

  if (voter.hasVoted) {
    throw new AppError("Voter has already cast a vote", 409);
  }

  const encryptedVote = encrypt(
    JSON.stringify({ voterId, candidateId, electionId: election.id, timestamp: new Date().toISOString() })
  );

  try {
    const result = await prisma.$transaction(async (tx) => {
      const vote = await tx.vote.create({
        data: {
          voterId,
          candidateId,
          electionId: election.id,
          encryptedVote,
        },
      });

      await tx.voter.update({
        where: { id: voterId },
        data: { hasVoted: true },
      });

      return vote;
    });

    return result;
  } catch (error) {
    if (error.code === "P2002") {
      throw new AppError("Duplicate vote attempt detected", 409);
    }
    throw error;
  }
};

module.exports = {
  castVote,
};
