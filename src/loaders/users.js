const Role = require("../models/role");
const { User } = require("../models/user");
const defaultUsers = require("../config/users");
const logger = require("../services/logger");

class RolesLoader {
  static async loadDefaults() {
    logger.info("Loading default users to DB...");
    for (const u of defaultUsers) {
      try {
        const role = await Role.findOne({ name: u.role });
        let user = await User.findOne({ email: u.email });
        if (role && !user) {
          const user = await User.create({
            role: role._id,
            email: u.email,
            name: u.name,
            password: u.password,
          });
        }
      } catch (error) {
        console.log(error);
        logger.warn(`Error while creating user in DB: ${u.role}.`);
      }
    }
  }
}

module.exports = RolesLoader;
