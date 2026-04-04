const prisma = require("../../config/prisma");
const electionService = require("../election/election.service");

const getDashboard = async () => {
  const [totalVoters, totalVotes, totalCandidates, activeElection, recentVotes] = await Promise.all([
    prisma.voter.count(),
    prisma.vote.count(),
    prisma.candidate.count(),
    prisma.election.findFirst({ where: { status: "ACTIVE" }, orderBy: { startDate: "desc" } }),
    prisma.vote.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        voter: { select: { name: true, voterId: true } },
        candidate: { select: { name: true, party: true } },
      },
    }),
  ]);

  const candidateStats = await prisma.vote.groupBy({
    by: ["candidateId"],
    _count: { _all: true },
  });

  const candidates = await prisma.candidate.findMany();
  const candidateMap = new Map(candidates.map((c) => [c.id, c]));

  const candidateStatistics = candidateStats.map((item) => ({
    candidateId: item.candidateId,
    candidateName: candidateMap.get(item.candidateId)?.name || "Unknown",
    party: candidateMap.get(item.candidateId)?.party || "Unknown",
    voteCount: item._count._all,
  }));

  return {
    summary: {
      totalVoters,
      totalVotes,
      totalCandidates,
      activeElection,
    },
    candidateStatistics,
    votingActivity: recentVotes,
  };
};

const startElection = async (electionId) => electionService.activateElection(electionId);

const endElection = async (electionId) => electionService.endElection(electionId);

module.exports = {
  getDashboard,
  startElection,
  endElection,
};
