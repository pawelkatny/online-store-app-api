const logger = require('../services/logger');
const CustomError = require('../error/customError');
const { getReasonPhrase } = require('http-status-codes');

const errorHandler = ((err, req, res, next) => {
    let statusCode = 500;
    logger.error(err.message);

    if (err instanceof CustomError) {
        statusCode = err.statusCode;
    }

    res.status(statusCode).send({ error: getReasonPhrase(statusCode) });
});

module.exports = errorHandler;