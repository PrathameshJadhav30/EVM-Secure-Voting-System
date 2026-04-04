const catchAsync = require("../../utils/catchAsync");
const authService = require("./auth.service");

const register = catchAsync(async (req, res) => {
  const result = await authService.registerVoter(req.validated.body);
  res.status(201).json({ success: true, message: "Voter registered", data: result });
});

const login = catchAsync(async (req, res) => {
  const result = await authService.loginVoter(req.validated.body);
  res.status(200).json({ success: true, message: "Login successful", data: result });
});

const adminLogin = catchAsync(async (req, res) => {
  const result = await authService.loginAdmin(req.validated.body);
  res.status(200).json({ success: true, message: "Admin login successful", data: result });
});

module.exports = {
  register,
  login,
  adminLogin,
};
