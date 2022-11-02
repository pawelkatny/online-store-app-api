const role = require('../models/role');
const { User } = require('../models/user');

class UserService {
    constructor(userId) {
        this.userId = userId;
    }

    async init() {
        const user = await User.findById(this.userId)
        .populate({ 
            path: 'role', 
            model: 'Role',
            populate: {
                path: 'permissions',
                model: 'Permission',
                select: 'tag -_id'
            }
        });

        if (!user) {
            throw Error('User not found.');
        }

        const permissionsMapped = user.role.permissions.map(p => p.tag);
        user.permissions = permissionsMapped;

        this.user = {
            name: user.name,
            role: role.name,
            permissions: permissionsMapped,
            email: user.email
        };

        console.log(this.user);
    }

    hasRole(name) {
        return this.user.role.name === name;
    }

    hasPermission(name) {
        return this.user.permissions.includes(name);
    }
}

module.exports = UserService;