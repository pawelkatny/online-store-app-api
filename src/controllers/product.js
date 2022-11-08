const CustomError = require('../error/customError');
const ProductService = require('../services/product');
const { StatusCodes } = require('http-status-codes');

const getProducts = async (req, res) => {
    const { query } = req;

    //build query object
    const queryObject = {};
    const products = await ProductService.getProducts(queryObject);

    res.status(StatusCodes.OK).json({ products });
}

const getProduct = async (req, res) => {
    const { id } = req.params;

    const product = await ProductService.getProduct(id);
    if (!product) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({ product });
}

const createProduct = async (req, res) => {
    const currentUser = req.user;
    if (!currentUser || !currentUser.hasPermission('edit-product')) {
        throw new CustomError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const { name,
        description,
        additionalInfo,
        tags,
        quantity,
        price } = req.body;
    const product = await ProductService.createProduct({
        name,
        description,
        additionalInfo,
        tags,
        quantity,
        price
    });

    if (!product) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.CREATED).json({ product });
}

const updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { 
        name, 
        description, 
        additionalInfo,
        tags, 
        quantity, 
        price } = req.body;

    const product = await ProductService(productId, {
        name, 
        description, 
        additionalInfo,
        tags, 
        quantity, 
        price
    });

    if (!product) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).send();
}

const deleteProduct = async (req, res) => {
    const { productId } = req.params;

    const product = await ProductService.deleteProduct(productId);
    if (!product) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).send();
}