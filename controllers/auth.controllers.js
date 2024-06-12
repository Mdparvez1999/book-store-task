const crypto = require("crypto");

const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/auth.utils");
const { generateToken } = require("../utils/jwt.utils");
const sendEmail = require("../utils/sendMail.utils");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");

const registerController = asyncHandler(async (req, res, next) => {

    const { userName, email, password, role } = req.body;

    if (!userName || !email || !password) {
        const err = new AppError("all fields are required", 400);
        return next(err);
    };

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
        userName,
        email,
        password: hashedPassword,
        role,
    });

    const token = generateToken(newUser._id);

    newUser.currentToken = token;
    await newUser.save();

    res.status(201).json({
        message: "success",
        token
    });
});

const loginController = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const err = new AppError("all fields are required", 400);
        return next(err);
    }

    const user = await User.findOne({ email });

    if (!user) {
        const err = new AppError("invalid credentials", 401);
        return next(err);
    };

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        const err = new AppError("invalid credentials", 401);

        return next(err);
    };

    const token = generateToken(user._id);

    user.currentToken = token;
    await user.save();

    res.status(200).json({
        message: "success",
        token
    });
});

const forgotPasswordController = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        const err = new AppError("email is required", 400);
        return next(err);
    };

    const user = await User.findOne({ email });

    if (!user) {
        const err = new AppError("invalid credentials", 401);

        return next(err);
    };

    const token = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256", process.env.FORGOT_PASSWORD_TOKEN)
        .update(token)
        .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const mailOptions = {
        from: "mohmdparvez78@gmail.com",
        to: user.email,
        subject: "password reset",
        html:
            `<h1>Click on the below link to reset your password</h1>
                <p>http://localhost:8000/api/v1/auth/reset-password/${token}</p>`
    };

    sendEmail(mailOptions);

    res.status(200).json({
        message: "success"
    });
});

const resetPasswordController = asyncHandler(async (req, res, next) => {
    const { password } = req.body;
    const token = req.params.token;

    const hashedToken = crypto.createHash("sha256", process.env.FORGOT_PASSWORD_TOKEN).update(token).digest("hex");

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
        const err = new AppError("token expired", 401);
        return next(err);
    };

    const hashedPassword = await hashPassword(password);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
        message: "success"
    });
});

module.exports = {
    registerController,
    loginController,
    forgotPasswordController,
    resetPasswordController
}
