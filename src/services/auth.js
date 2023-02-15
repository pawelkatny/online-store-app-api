const { Customer, User } = require("../models/user");
const CustomError = require("../error/customError");
const { StatusCodes } = require("http-status-codes");
const Role = require("../models/role");
const jwt = require("async-jsonwebtoken");
const { jwt_secret } = require("../config");

class AuthService {
  static async register(userData) {
    const { email, name, password } = userData;
    let token;
    let user = await Customer.findOne({ email: email });

    if (user) {
      throw new CustomError("Conflict", StatusCodes.CONFLICT);
    }

    const status = {
      success: false,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      token: null,
    };

    const role = await Role.findOne({ name: "customer" });

    user = await Customer.create({ email, password, name, role: role._id });
    await user.createActivationToken();
    await user.save();

    return {
      code: StatusCodes.CREATED,
      token: user.accountActivation.token,
    };
  }

  static async login(loginData) {
    const { email, password } = loginData;

    const user = await User.findOne({ email: email }).populate({
      path: "role",
      model: "Role",
    });

    if (!user) {
      throw new CustomError("Unathorized", StatusCodes.UNAUTHORIZED);
    }

    if (user.role.name == "customer" && !user.active) {
      throw new CustomError(
        "Account hasn`t been activated yet.",
        StatusCodes.UNAUTHORIZED
      );
    }

    const pwdMatch = await user.comparePwd(password);
    if (!pwdMatch) {
      throw new CustomError("Unathorized", StatusCodes.UNAUTHORIZED);
    }

    const token = await user.createToken();

    return { user: { name: user.name }, token };
  }

  static async verify(token) {
    const decoded = await jwt.verify(token, jwt_secret);
    return decoded;
  }

  static async createResetPwdToken(email) {
    const user = await User.findOne({ email: email });

    await user.createResetPwdToken();
    await user.save();

    return { token: user.passwordReset.token };
  }

  static async resetPassword(userId, token, password) {
    const status = {
      success: false,
    };

    const user = await User.findOne({
      _id: userId,
      "passwordReset.token": token,
    });

    if (user && (new Date() - user.passwordReset.createdAt) / 1000 > 3600) {
      status.msg = "Password reset token expired. Please try again.";
      status.code = StatusCodes.NOT_FOUND;
    }

    if (user && (new Date() - user.passwordReset.createdAt) / 1000 <= 3600) {
      user.password = password;
      await user.deleteResetPwdToken();
      await user.save();
      status.success = true;
      status.code = StatusCodes.OK;
    }

    return status;
  }

  static async activateAccount(token) {
    const status = {
      success: false,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    };

    const user = await Customer.findOne({
      confirmed: false,
      "accountActivation.token": token,
    });

    const currentDate = new Date();
    const expireAt = currentDate.setFullYear(currentDate.getFullYear() + 100);
    user.expireAt = expireAt;
    user.active = true;
    await user.save();

    status.success = true;
    status.code = StatusCodes.OK;

    return status;
  }
}

module.exports = AuthService;
