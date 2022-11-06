const { default: mongoose } = require('mongoose');
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
                return this.role.name === name;
            },
            hasPermission(name) {
                return this.permissions.includes(name);
            }
        };
    };

    static async deleteUserById(userId) {
        return User.findByIdAndDelete(userId);
    }

    static async getUserById(userId) {
        return User.findById(userId, { password: 0 }).populate({
            path: 'role',
            model: 'Role',
            select: '-_id',
            populate: {
                path: 'permissions',
                model: 'Permission',
                select: 'name tag -_id'
            }
        });
    }

    static async updateUserById(userId, update) {
        return User.findByIdAndUpdate(userId, { $set: update });
    }

    static async getUsers(params) {
        return User.find({}, { password: 0 }).populate({ path: 'role', select: 'name -_id' });;
    }

    static async createUser(userData) {
        const password = new mongoose.Types.ObjectId();
        const { name, email, roleName } = userData;
        return User.create({ name, email, password, roleName });
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
        const addressId = new mongoose.Types.ObjectId();
        return Customer.findByIdAndUpdate(userId, 
            { $push: { addresses: { ...addressData, _id: addressId }}});
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