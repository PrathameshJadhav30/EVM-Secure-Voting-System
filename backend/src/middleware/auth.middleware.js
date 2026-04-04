const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const { verifyToken } = require("../utils/jwt");

const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Unauthorized: token missing", 401));
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    if (payload.role === "ADMIN") {
      const admin = await prisma.admin.findUnique({ where: { id: payload.id } });
      if (!admin) return next(new AppError("Admin not found", 401));
      req.user = { id: admin.id, role: "ADMIN", email: admin.email };
      return next();
    }

    if (payload.role === "VOTER") {
      const voter = await prisma.voter.findUnique({ where: { id: payload.id } });
      if (!voter) return next(new AppError("Voter not found", 401));
      req.user = { id: voter.id, role: "VOTER", email: voter.email };
      return next();
    }

    return next(new AppError("Invalid token role", 401));
  } catch (_error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

const authorize = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError("Forbidden: insufficient permissions", 403));
  }
  return next();
};

module.exports = {
  authenticate,
  authorize,
};
