const User = require("../models/user.model");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const { hashPassword } = require("../utils/auth.utils");
const { generateToken } = require("../utils/jwt.utils");
const sendEmail = require("../utils/sendMail.utils");

const addUserController = asyncHandler(async (req, res, next) => {
    const { userName, email, password, role } = req.body;

    if (!userName || !email || !password) {
        const err = new AppError("all fields are required", 400);
        return next(err);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
        userName,
        email,
        password: hashedPassword,
        role
    });

    const token = generateToken(newUser._id);

    newUser.currentToken = token;
    await newUser.save();

    const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: newUser.email,
        subject: "Account created successfully",
        html: `<h1>Hi ${newUser.userName}</h1>
        <h1>Hi ${newUser.email}</h1>
        <h1>Hi ${newUser.role}</h1>
        <h2>Your account has been created successfully</h2>
        <p>Thanks</p>`
    };

    sendEmail(mailOptions);

    res.status(201).json({
        status: "success",
        newUser
    })
});

const addAdminController = asyncHandler(async (req, res, next) => {
    const { userName, email, password, role } = req.body;

    if (!userName || !email || !password) {
        const err = new AppError("all fields are required", 400);
        return next(err);
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = await User.create({
        userName,
        email,
        password: hashedPassword,
        role
    });

    const token = generateToken(newUser._id);

    newAdmin.currentToken = token;
    await newUser.save();

    const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: newAdmin.email,
        subject: "Account created successfully",
        html: `<h1>Hi ${newAdmin.userName}</h1>
        <h1>Hi ${newAdmin.email}</h1>
        <h1>Hi ${newAdmin.role}</h1>
        <h2>Your account has been created successfully</h2>
        <p>Thanks</p>`
    };

    sendEmail(mailOptions);

    res.status(201).json({
        status: "success",
        newAdmin
    })
});

module.exports = {
    addUserController,
    addAdminController
}