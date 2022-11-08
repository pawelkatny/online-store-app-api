const CustomError = require('../error/customError');
const CustomerService = require('../services/customer');
const { StatusCodes } = require('http-status-codes');

const getInfo = async (req, res) => {
    const currentUser = req.user;
    const user = await CustomerService.getInfo(currentUser.id);
    if (!user) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({ user });
}

const getCart = async (req, res) => {
    const currentUser = req.user;
    const cart = await CustomerService.getCart(currentUser.id);
    if (!cart) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({ cart });
}

const updateCart = async (req, res) => {
    const currentUser = req.user;
    const cartData = req.body;
    const cart = await CustomerService.updateCart(currentUser.id, cartData);
    if (!cart) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({ cart });
}

const getAddress = async (req, res) => {
    const currentUser = req.user;
    const { addressId } = req.params;
    const addresses = await CustomerService.getAddress(currentUser.id, addressId);
    if (!addresses) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json(addresses);
}

const getAddresses = async (req, res) => {
    const currentUser = req.user;
    const addresses = await CustomerService.getAddresses(currentUser.id);

    res.status(StatusCodes.OK).json(addresses);
}

const addAddress = async (req, res) => {
    const currentUser = req.user;
    const { name, street, zipCode, city, country } = req.body;
    const newAddress = await CustomerService.addAddress(currentUser.id, {
        name,
        street,
        zipCode,
        city,
        country
    });
    if (!newAddress) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    console.log(newAddress)
    res.status(StatusCodes.CREATED).send();
}

const updateAddress = async (req, res) => {
    const currentUser = req.user;
    const { name, street, zipCode, city, country } = req.body;
    const { addressId } = req.params;
    const address = await CustomerService.updateAddress(currentUser.id, addressId, {
        name, 
        street, 
        zipCode, 
        city, 
        country
    });
    if (!address) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).send();
}

const deleteAddress = async (req, res) => {
    const currentUser = req.user;
    const { addressId } = req.params;
    const deletedAddress = await CustomerService.deleteAddress(currentUser.id, addressId);
    if (!deletedAddress) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).send();
}

module.exports = {
    getInfo,
    getCart,
    updateCart,
    getAddress,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
}