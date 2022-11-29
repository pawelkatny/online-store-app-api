const { installed: { client_id, client_secret } } = require('../config/mailer/credentials.json');
const { refresh_token, access_token, expiry_date } = require('../config/mailer/token.json');\
const path = require('path');
const nodemailer = require('nodemailer');
const nmHandlebars = require('nodemailer-express-handlebars');


class MailerService {
    constructor() {
        this.createTransporter();
    }

    createTransporter() {
        nhbs = nmHandlebars({
            viewEngine: {
                defaultLayout: false
            },
            viewPath: path.resolve(__dirname, '../templates/email')
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'pawel.katny.dev@gmail.com',
                clientId: client_id,
                clientSecret: client_secret,
                refreshToken: refresh_token,
                accessToken: access_token,
                expires: expiry_date
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