const { default: mongoose } = require('mongoose');
const { Customer } = require('../models/user');

class CustomerService {
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

    static async getCustomerAddresses(userId) {
        return Customer.findById(userId, {
            addresses: 1 
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

module.exports = CustomerService;