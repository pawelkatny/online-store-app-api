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

const updateProductCart = async (req, res) => {
    const currentUser = req.user;
    const { productId } = req.params;
    const { qty } = req.body;
    const cart = await CustomerService.updateProductCartQty(currentUser.id, productId, qty);
    if (!cart) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({ cart });
}

const addToCart = async (req, res) => {
    const currentUser = req.user;
    const { productId } = req.body;
    const cart = await CustomerService.addProductToCart(currentUser.id, productId);
    if (!cart) {
        throw new CustomError('Something went wrong', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.CREATED).send();
}

const removeFromCart = async (req, res) => {
    const currentUser = req.user;
    const { productId } = req.params;
    const cart = await CustomerService.removeProductFromCart(currentUser.id, productId);
    if (!cart) {
        throw new CustomError('Something went wrong', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).send();
}

const clearCart = async (req, res) => {
    const currentUser = req.user;
    const cart = await CustomerService.clearCart(currentUser.id);
    if (!cart) {
        throw new CustomError('Something went wrong', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).send();
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

const addProductToFav = async (req, res) => {
    const currentUser = req.user;
    const { productId } = req.body;
    const favProduct = await CustomerService.addProductToFav(currentUser.id, productId);
    if (!favProduct) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.CREATED).send();
}

const removeProductFromFav = async (req, res) => {
    const currentUser = req.user;
    const { productId } = req.params;
    const favProduct = await CustomerService.removeProductFromFav(currentUser.id, productId);
    if (!favProduct) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).send();
}

const getFavProducts = async (req, res) => {
    const currentUser = req.user;
    const favProducts = await CustomerService.showFavProducts(currentUser.id);

    res.status(StatusCodes.OK).json({ favProducts });
}

const checkout = async (req, res) => {
    const currentUser = req.user;
    const checkout = await CustomerService.checkout(currentUser.id);

    if (checkout.isEmpty) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json({ checkout });
}

const showOrder = async (req, res) => {
    const currentUser = req.user;
    const { orderId } = req.params;

    const order = await CustomerService.showOrder(currentUser.id, orderId);
    if (!order) {
        if (checkout.isEmpty) {
            throw new CustomError('Not found', StatusCodes.NOT_FOUND);
        }
    }

    res.status(StatusCodes.OK).json({ order });
}

const showOrdersHistory = async (req, res) => {
    const currentUser = req.user;
    const orders = await CustomerService.showOrdersHistory(currentUser.id);

    res.status(StatusCodes.OK).json({ orders });
}
module.exports = {
    getInfo,
    getCart,
    updateProductCart,
    addToCart,
    removeFromCart,
    clearCart,
    getAddress,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    addProductToFav,
    removeProductFromFav,
    getFavProducts,
    checkout,
    showOrder,
    showOrdersHistory
}