const AuthService = require('../services/auth');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const { email, name, password } = req.body;
    const status = await AuthService.register({ email, name, password });

    res.status(status.code).send();
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login({ email, password });

    res.status(StatusCodes.OK).json({ user, token });
}

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    const status = await AuthService.sendResetPasswordEmail(email);

    res.status(status.code).json({ success: status.success, msg: status.msg });
}

const resetPassword = async (req, res) => {
    const { token, userId, password } = req.body;
    const status = await AuthService.resetPassword(userId, token, password);

    res.status(status.code).json({ success: status.success, msg: status.msg });
}

module.exports = {
    register,
    login,
    requestPasswordReset,
    resetPassword
}