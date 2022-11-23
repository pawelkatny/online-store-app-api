const CustomError = require('../error/customError');
const ReturnService = require('../services/return');
const { StatusCodes } = require('http-status-codes');

const getReturns = async (req, res) => {
    const currentUser = req.user;
    if (!currentUser.hasPermission('view-return')) {
        throw new CustomError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }
    const { query } = req;
    const queryObject = {};
    const returns = await ReturnService.getReturns(queryObject);

    res.status(StatusCodes.OK).json({ returns });
}

const getReturn = async (req, res) => {
    const currentUser = req.user;
    if (!currentUser.hasPermission('view-return')) {
        throw new CustomError('Unauthorized', StatusCodes.UNAUTHORIZED);
    }

    const { returnId } = req.params;
    const returnDoc = await ReturnService.getReturn(returnId);
    if (!returnDoc) {
        throw new CustomError('Not found', StatusCodes.NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({ returnDoc }); 
}

const createReturn = async (req, res) => {
    const currentUser = req.user;
    const { orderId, products, reason } = req.body;
    let customerId;

    if (!currentUser.hasRole('customer') && !currentUser.hasPermission('edit-return')) {
        throw new CustomError('Unauthorized', StatusCodes.UNAUTHORIZED);
    } 

    if (currentUser.hasRole('customer')) {
        customerId = currentUser.id;
    } 

    if (currentUser.hasPermission('edit-return')) {
        let { custId } = req.body;
        customerId = custId;
    } 

    const newReturn = await ReturnService.createReturn(customerId, { orderId, products, reason });

    if (!newReturn) {
        throw new CustomError('Something went wrong', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.CREATED).json({ newReturn });
}

module.exports = {
    getReturn,
    getReturns,
    createReturn
}