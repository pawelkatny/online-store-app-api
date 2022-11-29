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

        user = await Customer.create({ email, password, name, role: role._id });
        if (user) {
            token = await user.createToken();
        }

        return { user: { name: user.name }, token };
    }

    static async login(loginData) {
        const { email, password } = loginData;

        const user = await User.findOne({ email: email });
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

    static async sendResetPasswordEmail(email) {
        const user = await User.findOne({ email: email });
        const status = {
            success: false,
            msg: 'User does not exist.',
            code: StatusCodes.NOT_FOUND
        };

        if (user) {
            await user.createResetPwdToken();
            await user.save();
            //send reset email
            status.success = true;
            status.msg = 'Your password was reseted. Pleas check your email and follow further instructions.';
            status.code = StatusCodes.OK;
        }

        return status;
    }

    static async resetPassword(userId, tokenId, password) {
        const status = {
            success: false
        }

        const user = await User.findOne({
            _id: userId,
            "passwordReset.token": tokenId
        });

        if (!user) {
            status.msg = 'User does not exist.';
            status.code = StatusCodes.NOT_FOUND;
        }

        if (user && ((new Date() - user.passwordReset.createdAt) / 1000) > 3600) {
            status.msg = 'Password reset token expired. Please try again.';
            status.code = StatusCodes.NOT_FOUND;
        }

        if (user && ((new Date() - user.passwordReset.createdAt) / 1000) <= 3600) {
            user.password = password;
            await user.save();
            status.success = true;
            status.msg = 'Password successfully reseted. Please login using new password.';
            status.code = StatusCodes.OK;
        }

        return status;
    }
}

module.exports = AuthService;