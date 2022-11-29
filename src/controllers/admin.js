const { StatusCodes } = require('http-status-codes');
const MailerService = require('../services/mailer');
const dashboard = async (req, res) => {
    res.status(200).json({ user: req.user });
}

const checkMailerConfig = async (req, res) => {
    const currentUser = req.user;
    const mailer = new MailerService();
    const emailOptions = {
        header: {
            to: currentUser.email,
            subject: 'Testing Mailer Configuration',
            template: 'test',
            context: {
                name: currentUser.name.first
            }
        }
    }

    const email = await mailer.sendEmail(emailOptions);

    if (!email) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).send();
}

module.exports = {
    dashboard,
    checkMailerConfig
}