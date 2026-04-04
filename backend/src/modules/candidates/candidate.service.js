const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

const addCandidate = async (payload) => {
  return prisma.candidate.create({ data: payload });
};

const updateCandidate = async (id, payload) => {
  const exists = await prisma.candidate.findUnique({ where: { id } });
  if (!exists) throw new AppError("Candidate not found", 404);

  return prisma.candidate.update({ where: { id }, data: payload });
};

const deleteCandidate = async (id) => {
  const exists = await prisma.candidate.findUnique({ where: { id } });
  if (!exists) throw new AppError("Candidate not found", 404);

  await prisma.candidate.delete({ where: { id } });
  return { deleted: true };
};

const getCandidates = async () => {
  return prisma.candidate.findMany({ orderBy: { createdAt: "desc" } });
};

const getCandidateById = async (id) => {
  const candidate = await prisma.candidate.findUnique({ where: { id } });
  if (!candidate) throw new AppError("Candidate not found", 404);
  return candidate;
};

module.exports = {
  addCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidates,
  getCandidateById,
};
