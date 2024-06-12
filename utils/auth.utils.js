const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        console.log('error in hashing password : ', error);
    };
};

const comparePassword = async (password, dbPassword) => {
    return await bcrypt.compare(password, dbPassword);
}

module.exports = {
    hashPassword,
    comparePassword
}