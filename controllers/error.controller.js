const AppError = require("../utils/appError");

const errorHandler = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;

    error.status = error.status || 'error';

    if (error.code === 11000) {
        error = handleDuplicateError(error);
    }

    if (error.name === 'TokenExpiredError') {
        error = handleExpiredTokeError(error);
    }

    if (error.name === 'JsonWebTokenError') {
        error = handleJsonWebTokenError(error);
    }

    if (error.name === 'CastError') {
        error = handleCastError(error);
    }

    errorResult(error, res);
};


const handleDuplicateError = (error) => {
    let msg = `this ${error.keyValue.email} already exists`
    return new AppError(msg, 400);
}

const handleExpiredTokeError = (error) => {
    return new AppError('session expired, please login again', 401)
}

const handleJsonWebTokenError = (error) => {
    return new AppError('you\'re not authorized to access this page', 401)
}

const handleCastError = (error) => {
    return new AppError(`${error.value} is not a proper Id for a product`, 400)
}

const errorResult = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'something went wrong'
        });
    }
};

module.exports = errorHandler;

