const { web: { client_id, client_secret, redirect_uris } } = require('../config/mailer/credentials.json');
const { refresh_token, access_token, expiry_date } = require('../config/mailer/token.json');
const path = require('path');
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nmHandlebars = require('nodemailer-express-handlebars');
const { threadId } = require('worker_threads');


class MailerService {
    constructor() {
        this.clientId = client_id;
        this.clientSecret = client_secret;
        this.redirectUri = redirect_uris[0];
        this.accessToken = access_token;
        this.refreshToken = refresh_token;
        this.expiryDate = expiry_date; 
    }

    async getAccessToken() {
        const oauth2Client = new OAuth2(this.clientId, this.clientSecret, this.redirectUri);
        oauth2Client.setCredentials({
            refresh_token: this.refreshToken
        });

        const res = await oauth2Client.getAccessToken();
        return res.token;
    }

    async createTransporter() {
        const nhbs = nmHandlebars({
            viewEngine: {
                defaultLayout: false
            },
            viewPath: path.resolve(__dirname, '../templates/email')
        });

        const accessToken = await this.getAccessToken();
        this.accessToken = accessToken;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'pawel.katny.dev@gmail.com',
                clientId: this.clientId,
                clientSecret: this.clientSecret,
                refreshToken: this.refreshToken,
                accessToken: this.accessToken,
                expires: this.expiryDate
            }
        }, {
            from: 'Test account <pawel.katny.dev@gmail.com>'
        });

        transporter.use('compile', nhbs);
        this.transporter = transporter;
    }

    async sendEmail(options) {

        const message = {
            to: options.header.to,
            subject: options.header.subject,
            template: options.template,
            context: { ...options.context }
        }

        return this.transporter.sendMail(message);
    }
}

module.exports = MailerService;