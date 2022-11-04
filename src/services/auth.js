const { User } = require('../models/user');
const Role = require('../models/role');
const jwt = require('async-jsonwebtoken');
const { jwt_secret } = require('../config');

class AuthService {

    static async register(userData) {

        const { email, name, password, roleName } = userData;

        let token;
        let user = await User.findOne({ email: email });
        if (user) {
            throw Error('User already exists');
        }

        const role = await Role.findOne({ name: roleName });

        user = await User.create( {email, password, name, role: role._id });
        if (user) {
            token = await user.createToken();
        }

        return { user: { name: user.name }, token };
    }

    static async login(loginData) {
        const { email, password } = loginData;

        const user = await User.findOne( { email: email });
        if (!user) {
            throw Error('Incorrect user or password.');
        }
        const pwdMatch = await user.comparePwd(password);
        if (!pwdMatch) {
            throw Error('Incorrect user or password.');
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