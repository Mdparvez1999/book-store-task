const transporter = require("../config/nodeMailerConfig");

const sendEmail = (mailOptions) => {
    try {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("error in sending email : ", error);
                return next(error);
            }
            console.log("email sent");
        });
    } catch (error) {
        next(error);
    }
};

module.exports = sendEmail;