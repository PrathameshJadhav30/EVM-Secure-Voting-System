const express = require("express");
const validate = require("../../middleware/validate.middleware");
const authController = require("./auth.controller");
const { registerSchema, voterLoginSchema, adminLoginSchema } = require("./auth.validator");

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(voterLoginSchema), authController.login);
router.post("/admin-login", validate(adminLoginSchema), authController.adminLogin);

module.exports = router;
