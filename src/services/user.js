const role = require('../models/role');
const { User } = require('../models/user');

class UserService {
    
    static async mapUserToObj(userId) {
        const user = await User.findById(userId)
        .populate({ 
            path: 'role', 
            model: 'Role',
            populate: {
                path: 'permissions',
                model: 'Permission',
                select: 'tag'
            }
        });

        if (!user) {
            throw Error('User not found.');
        }

        const permissionsMapped = user.role.permissions.map(p => p.tag);

        return {
            name: user.name,
            role: user.role.name,
            permissions: permissionsMapped,
            email: user.email,
            hasRole(name) {
                return this.user.role.name === name;
            },
            hasPermission(name) {
                return this.user.permissions.includes(name);
            }
        };
    };

    static async deleteUserById(userId) {
        return User.findByIdAndDelete(userId);
    }

    static async getUserById(userId) {
        return User.findById(userId);
    }

    static async updateUserById(userId, update) {
        return User.findByIdAndUpdate(userId, update);
    }

    static async getUsers(params) {
        return User.find(params);
    }

    static async createUser(userData) {
        return User.create({ userData });
    }
}

module.exports = UserService;