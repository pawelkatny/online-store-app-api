const { User } = require('../models/user');

class AuthService {

    static async register(userData) {
        const { email, password, name, role } = userData;

        let token;
        let user = await User.findOne({ email: email });

        if (user) {
            throw Error('User already exists');
        }

        user = await User.create( {email, password, name, role });
        
        if (user) {
            token = user.createToken();
        }

        return { user: { name }, token };
    }

    static async login(loginData) {

    }

}

module.exports = AuthService;