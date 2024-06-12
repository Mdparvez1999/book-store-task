const { registerController, loginController, forgotPasswordController, resetPasswordController } = require("../controllers/auth.controllers");

const router = require("express").Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/forgot-password", forgotPasswordController);

router.post("/reset-password/:token", resetPasswordController);

module.exports = router;