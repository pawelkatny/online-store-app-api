const { StatusCodes, getReasonPhrase } = require("http-status-codes");

const success = (statusCode, data = {}) => {
  return {
    message: getReasonPhrase(statusCode),
    statusCode,
    error: false,
    data,
  };
};

const error = (statusCode, message) => {
  return {
    message,
    statusCode,
    error: true,
  };
};

const validation = (statusCode, errors) => {
  return {
    message: getReasonPhrase(statusCode),
    statusCode,
    error: true,
    errors,
  };
};

module.exports = {
  success,
  error,
  validation,
};
