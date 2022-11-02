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
    const userService = new UserService(id);
    await userService.init();
    req.user = userService;
    
    return next();
}

const isAdmin = async (req, res, next) => {
    if(req.user.hasRole('customer')) {
        throw new Error('Unauthorized');
    }
    
    return next();
}

module.exports = {
    isAuthenticated,
    isAdmin
}