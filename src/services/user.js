const { default: mongoose } = require("mongoose");
const role = require("../models/role");
const { User } = require("../models/user");

class UserService {
  static async mapUserToObj(userId) {
    const user = await User.findById(userId).populate({
      path: "role",
      model: "Role",
      populate: {
        path: "permissions",
        model: "Permission",
        select: "tag",
      },
    });

    if (!user) {
      throw Error("User not found.");
    }

    const permissionsMapped = user.role.permissions.map((p) => p.tag);

    return {
      id: userId,
      name: user.name,
      role: user.role.name,
      permissions: permissionsMapped,
      email: user.email,
      hasRole(name) {
        return this.role === name;
      },
      hasPermission(name) {
        return this.permissions.includes(name);
      },
    };
  }

  static async deleteUserById(userId) {
    return User.findByIdAndDelete(userId);
  }

  static async getUserById(userId) {
    return User.findById(userId, { password: 0 }).populate({
      path: "role",
      model: "Role",
      select: "-_id",
      populate: {
        path: "permissions",
        model: "Permission",
        select: "name tag -_id",
      },
    });
  }

  static async updateUserById(userId, update) {
    return User.findByIdAndUpdate(userId, { $set: update });
  }

  static async getUsers(query) {
    const { email, firstName, lastName, phone, sort } = query;
    const queryObject = {};

    if (email) {
      queryObject.email = { $regex: email, $options: "i" };
    }

    if (firstName) {
      queryObject["name.first"] = {
        $regex: firstName,
        $options: "i",
      };
    }

    if (lastName) {
      queryObject["name.last"] = {
        $regex: lastName,
        $options: "i",
      };
    }

    if (phone) {
      queryObject.phone = { $regex: email, $options: "i" };
    }

    const users = User.find(queryObject, { password: 0 }).populate({
      path: "role",
      select: "name -_id",
    });

    if (sort) {
      const [option, type] = sort.split("#");
      const sortObject = {};
      sortObject[option] = type;
      users.sort(sortObject);
    }

    return users;
  }

  static async createUser(userData) {
    const password = new mongoose.Types.ObjectId();
    const { name, email, roleName } = userData;
    return User.create({ name, email, password, roleName });
  }

  static async getMe(userId) {
    return User.findById(userId);
  }
}

module.exports = UserService;
