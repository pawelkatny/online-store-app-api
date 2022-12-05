const { StatusCodes } = require('http-status-codes');
const MailerService = require('../services/mailer');
const CustomError = require('../error/customError');

const dashboard = async (req, res) => {
    res.status(200).json({ user: req.user });
}

const checkMailerConfig = async (req, res) => {
    const currentUser = req.user;
    currentUser.email = 'pawel.katny@gmail.com'
    if (!currentUser.hasRole('admin')) {
        throw new CustomError('Unathorized', StatusCodes.UNAUTHORIZED);
    }

    const mailer = new MailerService();
    const emailOptions = {
        header: {
            to: currentUser.email,
            subject: 'Testing Mailer Configuration',
        },
        template: 'test',
        context: {
            name: currentUser.name.first
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