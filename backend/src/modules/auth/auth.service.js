const bcrypt = require("bcrypt");
const prisma = require("../../config/prisma");
const AppError = require("../../utils/AppError");
const { signToken } = require("../../utils/jwt");

const registerVoter = async (payload) => {
  const exists = await prisma.voter.findFirst({
    where: {
      OR: [{ email: payload.email }, { voterId: payload.voterId }],
    },
  });

  if (exists) {
    throw new AppError("Voter with email or voterId already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const voter = await prisma.voter.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      voterId: true,
      age: true,
      hasVoted: true,
      createdAt: true,
    },
  });

  const token = signToken({ id: voter.id, role: "VOTER" });

  return { voter, token };
};

const loginVoter = async ({ email, password }) => {
  const voter = await prisma.voter.findUnique({ where: { email } });
  if (!voter) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, voter.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const token = signToken({ id: voter.id, role: "VOTER" });

  return {
    voter: {
      id: voter.id,
      name: voter.name,
      email: voter.email,
      voterId: voter.voterId,
      age: voter.age,
      hasVoted: voter.hasVoted,
    },
    token,
  };
};

const loginAdmin = async ({ email, password }) => {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) throw new AppError("Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new AppError("Invalid credentials", 401);

  const token = signToken({ id: admin.id, role: "ADMIN" });

  return {
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
    token,
  };
};

module.exports = {
  registerVoter,
  loginVoter,
  loginAdmin,
};
