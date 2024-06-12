class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = this.statusCode > 400 && this.statusCode < 500 ? 'fail' : 'server error';
        this.isOperational = true;
    }
};

module.exports = AppError;