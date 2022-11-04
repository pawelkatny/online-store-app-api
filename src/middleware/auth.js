const AuthService = require('../services/auth');
const UserService = require('../services/user');

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
    console.log(req.user);
    return next();
}

module.exports = {
    isAuthenticated,
}