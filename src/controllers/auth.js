const AuthService = require('../services/auth');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const { email, name, password } = req.body;
    const { user, token } = await AuthService.register({ email, name, password, roleName: 'admin' });

    res.status(StatusCodes.CREATED).json({ user, token });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login({ email, password });

    res.status(StatusCodes.OK).json({ user, token });
}
module.exports = {
    register,
    login
}