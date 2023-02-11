const AuthService = require("../services/auth");
const { StatusCodes } = require("http-status-codes");
const { success } = require("../helpers/responseApi");

const register = async (req, res) => {
  const { email, name, password } = req.body;
  const { code: statusCode, token } = await AuthService.register({
    email,
    name,
    password,
  });

  res.status(statusCode).send(success(statusCode, { token }));
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await AuthService.login({ email, password });

  res.status(StatusCodes.OK).json(success(StatusCodes.OK, { user, token }));
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const { token } = await AuthService.createResetPwdToken(email);

  res.status(StatusCodes.OK).json(success(StatusCodes.OK, { token }));
};

const resetPassword = async (req, res) => {
  const { pwdResetToken, userId, password } = req.body;
  const { code: statusCode, token } = await AuthService.resetPassword(
    userId,
    pwdResetToken,
    password
  );

  res.status(statusCode).json(success(statusCode));
};

const activateAccount = async (req, res) => {
  const { token } = req.params;
  const { code: statusCode } = await AuthService.activateAccount(token);

  res.status(statusCode).json(success(statusCode));
};

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
  activateAccount,
};
