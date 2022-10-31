const AuthService = require('../services/auth');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
    const { email, name, password } = req.body;
    const { user, token } = await AuthService.register({ email, name, password, roleName: 'customer' });

    res.status(StatusCodes.CREATED).json({ user, token });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = AuthService.login({ email, password });
}
module.exports = {
    register
}