const User = require("../models/user.model");
const AppError = require("../utils/appError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/jwt.utils");

const auth = asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer")) {
        const msg = "unauthorized access";
        const err = new AppError(msg, 401);
        return next(err);
    }

    const token = authorization.split(" ")[1];

    const decodedToken = verifyToken(token);

    const existingUser = await User.findById(decodedToken.id).select("-password");

    if (!existingUser || existingUser.currentToken !== token) {
        const msg = "unauthorized access";
        const err = new AppError(msg, 401);
        return next(err);
    };

    req.user = existingUser;

    next();
});

module.exports = auth;