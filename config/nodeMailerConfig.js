const nodeMailer = require("nodemailer");
const { google } = require("googleapis");

const client_id = process.env.CLIENT_ID
const client_secret = process.env.CLIENT_SECRET
const redirect_uris = process.env.REDIRECT_URI
const refresh_token = process.env.REFRESH_TOKEN

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris);

oAuth2Client.setCredentials({ refresh_token: refresh_token });

const accessToken = oAuth2Client.getAccessToken();

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.HOST_EMAIL,
        clientId: client_id,
        clientSecret: client_secret,
        refreshToken: refresh_token,
        accessToken: accessToken
    }
});

module.exports = transporter;