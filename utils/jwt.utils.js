const JWT = require("jsonwebtoken");

const generateToken = (id) => {
    const token = JWT.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: 24 * 60 * 60 * 1000
    });

    return token;
};

const verifyToken = (token) => {
    return JWT.verify(token, process.env.JWT_SECRET);
}

module.exports = {
    generateToken,
    verifyToken
};