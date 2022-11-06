const role = require('../models/role');
const { User, Customer } = require('../models/user');

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

    static async getCustomerInfo(userId) {
        return Customer.findById(userId);
    }

    static async getCustomerCart(userId) {
        return Customer.findById(userId, { cart: 1 });
    }

    static async updateCustomerCart(userId, cartData) {
        return Customer.findByIdAndUpdate(userId, { $set: cartData });
    }

    static async getCustomerAddress(userId, addressId) {
        return Customer.findOne({
            _id: userId,
            addresses: {
                _id: addressId
            }
        });
    }

    static async addCustomerAddress(userId, addressData) {
        return Customer.findById(userId).addAddress(addressData);
    }

    static async updateCustomerAddress(userId, addressId, addressData) {
        return Customer.updateOne({ _id: userId, addresses: { _id: addressId } }, { $set: addressData });
    }

    static async deleteCustomerAddress(userId, addressId) {
        return Customer.findByIdAndUpdate(userId, {
            $pull: {
                addresses: {
                    _id: addressId
                }
            }
        });
    }
}

module.exports = UserService;