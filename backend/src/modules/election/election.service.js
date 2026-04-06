const { ElectionStatus } = require("@prisma/client");
const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

const createElection = async (payload) => {
  if (payload.endDate <= payload.startDate) {
    throw new AppError("endDate must be later than startDate", 400);
  }

  return prisma.election.create({
    data: {
      electionName: payload.electionName,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: ElectionStatus.UPCOMING,
    },
  });
};

const activateElection = async (electionId) => {
  const election = await prisma.election.findUnique({ where: { id: electionId } });
  if (!election) throw new AppError("Election not found", 404);

  await prisma.election.updateMany({
    where: { status: ElectionStatus.ACTIVE },
    data: { status: ElectionStatus.ENDED },
  });

  return prisma.election.update({
    where: { id: electionId },
    data: { status: ElectionStatus.ACTIVE },
  });
};

const endElection = async (electionId) => {
  const election = await prisma.election.findUnique({ where: { id: electionId } });
  if (!election) throw new AppError("Election not found", 404);

  return prisma.election.update({
    where: { id: electionId },
    data: { status: ElectionStatus.ENDED },
  });
};

const getCurrentElection = async () => {
  const active = await prisma.election.findFirst({
    where: { status: ElectionStatus.ACTIVE },
    orderBy: { startDate: "desc" },
  });

  if (active) return active;

  const upcoming = await prisma.election.findFirst({
    where: { status: ElectionStatus.UPCOMING },
    orderBy: { startDate: "asc" },
  });

  return upcoming || null;
};

const getActiveElectionForVoting = async () => {
  const election = await prisma.election.findFirst({
    where: { status: ElectionStatus.ACTIVE },
  });

  if (!election) throw new AppError("No active election", 400);

  const now = new Date();
  if (now < election.startDate || now > election.endDate) {
    throw new AppError("Voting is not allowed outside election time", 400);
  }

  return election;
};

module.exports = {
  createElection,
  activateElection,
  endElection,
  getCurrentElection,
  getActiveElectionForVoting,
};
