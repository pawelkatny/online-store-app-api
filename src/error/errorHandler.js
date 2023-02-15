const logger = require("../services/logger");
const CustomError = require("../error/customError");
const ValidatorError = require("mongoose").Error;
const { getReasonPhrase } = require("http-status-codes");
const { error, validation } = require("../helpers/responseApi");

const errorHandler = (err, req, res, next) => {
  let message,
    response,
    errors,
    statusCode = 500;

  logger.error(err.message);
  console.log(err.errors);
  if (err instanceof CustomError) {
    statusCode = err.statusCode;
  }

  message = getReasonPhrase(statusCode);
  response = error(statusCode, message);

  if (err instanceof ValidatorError) {
    statusCode = 422;
    errors = Object.keys(err.errors).map((key) => {
      return err.errors[key].properties.message;
    });
    response = validation(statusCode, errors);
  }

  res.status(statusCode).send(response);
};

module.exports = errorHandler;
