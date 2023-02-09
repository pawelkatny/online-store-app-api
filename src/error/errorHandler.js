const logger = require("../services/logger");
const CustomError = require("../error/customError");
const ValidatorError = require("mongoose").Error;
const { getReasonPhrase } = require("http-status-codes");

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;

  logger.error(err.message);
  console.log(err.errors);
  if (err instanceof CustomError) {
    statusCode = err.statusCode;
  }

  let message = [getReasonPhrase(statusCode)];

  if (err instanceof ValidatorError) {
    statusCode = 422;
    message = Object.keys(err.errors).map((key) => {
      return err.errors[key].properties.message;
    });
  }

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
