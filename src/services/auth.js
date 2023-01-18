const { Customer, User } = require("../models/user");
const CustomError = require("../error/customError");
const { StatusCodes } = require("http-status-codes");
const Role = require("../models/role");
const MailerService = require("./mailer");
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
    };

    const role = await Role.findOne({ name: "customer" });

    user = await Customer.create({ email, password, name, role: role._id });
    if (user) {
      await user.createActivationToken();
      await user.save();
    }

    if (user.accountActivation.token) {
      const mailer = new MailerService();
      await mailer.createTransporter();
      const emailOptions = {
        header: {
          to: email,
          subject: "Account activation",
        },
        template: "account-activation",
        context: {
          companyName: "TESTING PRODUCT",
          name: user.name.first,
          activateLink: user.accountActivation.token,
        },
      };
      const emailStatus = await mailer.sendEmail(emailOptions);
      console.log({ emailStatus });
      if (emailStatus.messageId) {
        status.success = true;
        status.code = StatusCodes.CREATED;
      }
    }

    return status;
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

  static async sendResetPasswordEmail(email) {
    const user = await User.findOne({ email: email });
    const status = {
      success: false,
      msg: "User does not exist.",
      code: StatusCodes.NOT_FOUND,
    };

    if (user) {
      await user.createResetPwdToken();
      await user.save();

      const mailer = new MailerService();
      const emailOptions = {
        header: {
          to: email,
          subject: "Password reset",
        },
        template: "password-reset",
        context: {
          companyName: "TESTING PRODUCT",
          name: user.name.first,
          resetPwdUri: user.passwordReset.token,
        },
      };
      const emailStatus = await mailer.sendEmail(emailOptions);

      if (emailStatus.messageId) {
        status.success = true;
        status.msg =
          "Your password was reseted. Pleas check your email and follow further instructions.";
        status.code = StatusCodes.OK;
      }
    }

    return status;
  }

  static async resetPassword(userId, token, password) {
    const status = {
      success: false,
    };

    const user = await User.findOne({
      _id: userId,
      "passwordReset.token": token,
    });

    if (!user) {
      status.msg = "User does not exist.";
      status.code = StatusCodes.NOT_FOUND;
    }

    if (user && (new Date() - user.passwordReset.createdAt) / 1000 > 3600) {
      status.msg = "Password reset token expired. Please try again.";
      status.code = StatusCodes.NOT_FOUND;
    }

    if (user && (new Date() - user.passwordReset.createdAt) / 1000 <= 3600) {
      user.password = password;
      await user.save();
      status.success = true;
      status.msg =
        "Password successfully reseted. Please login using new password.";
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

    if (!user) {
      status.msg = "User does not exist.";
      status.code = StatusCodes.NOT_FOUND;
    }

    const currentDate = new Date();
    const expireAt = currentDate.setFullYear(currentDate.getFullYear() + 100);
    user.expireAt = expireAt;
    user.active = true;
    await user.save();

    status.success = true;
    status.msg = "Your account has been activated. You can now log in.";
    status.code = StatusCodes.OK;

    return status;
  }
}

module.exports = AuthService;
