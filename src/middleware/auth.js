const AuthService = require('../services/auth');
const UserService = require('../services/user');
const CustomError = require('../error/customError');
const { StatusCodes } = require('http-status-codes');

const isAuthenticated = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer')) {
        throw new Error('Missing or invalid token.');
    }

    const token = authorization.split(' ')[1];
    const [ decoded, err] = await AuthService.verify(token);
    if (err) {
        throw new Error('Missing or invalid token.');
    }
    
    const { id } = decoded;
    req.user = await UserService.mapUserToObj(id);


    return next();
}

const isCustomer = async (req, res, next) => {
    const currentUser = req.user;
    if (!currentUser.hasRole('customer')) {
        throw new CustomError('Unathorized', StatusCodes.UNAUTHORIZED);
    }

    next();
}

module.exports = {
    isAuthenticated,
    isCustomer
}