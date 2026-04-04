const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

const buildResultStats = async (electionId) => {
  const election = await prisma.election.findUnique({ where: { id: electionId } });
  if (!election) throw new AppError("Election not found", 404);

  const totalVotes = await prisma.vote.count({ where: { electionId } });

  const grouped = await prisma.vote.groupBy({
    by: ["candidateId"],
    where: { electionId },
    _count: { _all: true },
  });

  const candidateIds = grouped.map((g) => g.candidateId);
  const candidates = candidateIds.length
    ? await prisma.candidate.findMany({ where: { id: { in: candidateIds } } })
    : [];

  const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));

  const results = grouped
    .map((group) => {
      const candidate = byId.get(group.candidateId);
      const votes = group._count._all;
      const percentage = totalVotes ? Number(((votes / totalVotes) * 100).toFixed(2)) : 0;

      return {
        candidateId: group.candidateId,
        candidateName: candidate?.name || "Unknown",
        party: candidate?.party || "Unknown",
        votes,
        percentage,
      };
    })
    .sort((a, b) => b.votes - a.votes);

  const winner = results[0] || null;

  return {
    election: {
      id: election.id,
      electionName: election.electionName,
      status: election.status,
      startDate: election.startDate,
      endDate: election.endDate,
    },
    totalVotes,
    results,
    winner,
  };
};

const getResults = async () => {
  const election = await prisma.election.findFirst({
    where: { status: "ACTIVE" },
    orderBy: { startDate: "desc" },
  });

  const fallback = election
    ? election
    : await prisma.election.findFirst({ orderBy: { startDate: "desc" } });

  if (!fallback) throw new AppError("No election found", 404);
  return buildResultStats(fallback.id);
};

const getWinner = async () => {
  const resultData = await getResults();
  return {
    election: resultData.election,
    winner: resultData.winner,
  };
};

module.exports = {
  getResults,
  getWinner,
};
