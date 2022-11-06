const CustomError = require('../error/customError');
const CustomerService = require('../services/customer');
const { StatusCodes } = require('http-status-codes');

const getCustomerInfo = async (userId) => {
    return CustomerService.getInfo(userId);
}

const getCustomerCart = async (userId) => {
    return CustomerService.getCart(userId);
}

const updateCart = async (userId, cartData) => {
    return CustomerService.updateCart(userId, cartData);
}

const getAddress = async (userId, addressId) => {
    return CustomerService.getAddress(userId, addressId);
}

const getAddresses = async (userId, addressId) => {
    return CustomerService.getAddresses(userId);
}

const addAddress = async (userId, addressData) => {
    return CustomerService.addAddress(userId, addressData);
}

const updateAddress = async (userId, addressId, addressData) => {
    return CustomerService.updateAddress(userId, addressId, addressData);
}

const deleteAddress = async (userId, addressId) => {
    return CustomerService.deleteAddress(userId, addressId);
}

module.exports = {
    getCustomerInfo,
    getCustomerCart,
    updateCart,
    getAddress,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
}