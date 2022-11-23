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