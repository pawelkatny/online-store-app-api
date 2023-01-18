const { user, password } = require("../config/mailer/credentials.json");
const path = require("path");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const nmHandlebars = require("nodemailer-express-handlebars");
const { threadId } = require("worker_threads");

class MailerService {
  constructor() {
    this.user = user;
    this.password = password;
  }

  async createTransporter() {
    const nhbs = nmHandlebars({
      viewEngine: {
        defaultLayout: false,
      },
      viewPath: path.resolve(__dirname, "../templates/email"),
    });

    const transporter = nodemailer.createTransport(
      {
        service: "gmail",
        auth: {
          user: this.user,
          pass: this.password,
        },
      },
      {
        from: "Test account <pawel.katny.dev@gmail.com>",
      }
    );

    transporter.use("compile", nhbs);
    this.transporter = transporter;
  }

  async sendEmail(options) {
    const message = {
      to: options.header.to,
      subject: options.header.subject,
      template: options.template,
      context: { ...options.context },
    };

    return this.transporter.sendMail(message);
  }
}

module.exports = MailerService;
