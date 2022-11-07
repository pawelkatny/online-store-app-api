const { Customer, User } = require('../models/user');
const CustomError = require('../error/customError');
const { StatusCodes } = require('http-status-codes');
const Role = require('../models/role');
const jwt = require('async-jsonwebtoken');
const { jwt_secret } = require('../config');

class AuthService {

    static async register(userData) {

        const { email, name, password } = userData;

        let token;
        let user = await Customer.findOne({ email: email });
        if (user) {
            throw new CustomError('Conflict', StatusCodes.CONFLICT);
        }

        const role = await Role.findOne({ name: 'customer' });

        user = await Customer.create( {email, password, name, role: role._id });
        if (user) {
            token = await user.createToken();
        }

        return { user: { name: user.name }, token };
    }

    static async login(loginData) {
        const { email, password } = loginData;

        const user = await User.findOne( { email: email });
        if (!user) {
            throw new CustomError('Unathorized', StatusCodes.UNAUTHORIZED);
        }

        const pwdMatch = await user.comparePwd(password);
        if (!pwdMatch) {
            throw new CustomError('Unathorized', StatusCodes.UNAUTHORIZED);
        }

        const token = await user.createToken();

        return { user: { name: user.name }, token };
    }

    static async verify(token) {
        const decoded = await jwt.verify(token, jwt_secret);
        return decoded;
    }

}

module.exports = AuthService;