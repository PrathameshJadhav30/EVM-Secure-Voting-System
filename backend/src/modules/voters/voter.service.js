const bcrypt = require("bcrypt");
const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");

const sanitizeVoter = (voter) => ({
  id: voter.id,
  name: voter.name,
  email: voter.email,
  voterId: voter.voterId,
  age: voter.age,
  hasVoted: voter.hasVoted,
  createdAt: voter.createdAt,
});

const getAllVoters = async () => {
  const voters = await prisma.voter.findMany({ orderBy: { createdAt: "desc" } });
  return voters.map(sanitizeVoter);
};

const getVoterById = async (id, currentUser) => {
  if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
    throw new AppError("You can only view your own profile", 403);
  }

  const voter = await prisma.voter.findUnique({ where: { id } });
  if (!voter) throw new AppError("Voter not found", 404);
  return sanitizeVoter(voter);
};

const updateVoter = async (id, payload, currentUser) => {
  if (currentUser.role !== "ADMIN" && currentUser.id !== id) {
    throw new AppError("You can only update your own profile", 403);
  }

  const existing = await prisma.voter.findUnique({ where: { id } });
  if (!existing) throw new AppError("Voter not found", 404);

  const updateData = { ...payload };
  if (payload.password) {
    updateData.password = await bcrypt.hash(payload.password, 10);
  }

  const voter = await prisma.voter.update({
    where: { id },
    data: updateData,
  });

  return sanitizeVoter(voter);
};

const deleteVoter = async (id) => {
  const existing = await prisma.voter.findUnique({ where: { id } });
  if (!existing) throw new AppError("Voter not found", 404);

  await prisma.voter.delete({ where: { id } });
  return { deleted: true };
};

module.exports = {
  getAllVoters,
  getVoterById,
  updateVoter,
  deleteVoter,
};
