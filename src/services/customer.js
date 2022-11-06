const { default: mongoose } = require('mongoose');
const { Customer } = require('../models/user');

class CustomerService {
    static async getInfo(userId) {
        return Customer.findById(userId);
    }

    static async getCart(userId) {
        return Customer.findById(userId, { cart: 1 });
    }

    static async updateCart(userId, cartData) {
        return Customer.findByIdAndUpdate(userId, { $set: cartData });
    }

    static async getAddress(userId, addressId) {
        return Customer.findOne({
            _id: userId,
            addresses: {
                _id: addressId
            }
        });
    }

    static async getAddresses(userId) {
        return Customer.findById(userId, {
            addresses: 1 
        });
    }

    static async addAddress(userId, addressData) {
        const addressId = new mongoose.Types.ObjectId();
        return Customer.findByIdAndUpdate(userId, 
            { $push: { addresses: { ...addressData, _id: addressId }}});
    }

    static async updateAddress(userId, addressId, addressData) {
        return Customer.updateOne({ _id: userId, addresses: { _id: addressId } }, { $set: addressData });
    }

    static async deleteAddress(userId, addressId) {
        return Customer.findByIdAndUpdate(userId, {
            $pull: {
                addresses: {
                    _id: addressId
                }
            }
        });
    }
}

module.exports = CustomerService;