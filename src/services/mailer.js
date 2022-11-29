const { installed: { client_id, client_secret } } = require('../config/mailer/credentials.json');
const { refresh_token, access_token, expiry_date } = require('../config/mailer/token.json');
const nodemailer = require('nodemailer');

class MailerService {
    constructor() {
        this.createTransporter();
    }

    createTransporter() {
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

        this.transporter = transporter;
    }

    loadEmailTemplate() {

    }

    sendEmail(options) {
        
    }
}