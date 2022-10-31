const AuthService = require('../services/auth');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const { user, token } = await AuthService.register(userData);

    res.status(StatusCodes.CREATED).json({ user, token });
}

module.exports = {
    register
}