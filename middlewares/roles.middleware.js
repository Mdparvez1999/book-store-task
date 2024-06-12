const AppError = require("../utils/appError");

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        const err = new AppError("unauthorized access", 403);
        return next(err);
    };

    next();
};

const isSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'superadmin') {
        const err = new AppError("unauthorized access", 403);
        return next(err);
    };

    next();
};

const isAdminOrSuperAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
        const err = new AppError("unauthorized access", 403);
        return next(err);
    };

    next();
};

module.exports = {
    isAdmin,
    isSuperAdmin,
    isAdminOrSuperAdmin
}