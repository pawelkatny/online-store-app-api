const Role = require("../models/role");
const User = require("../models/user");
const defaultUsers = require("../config/users");
const logger = require("../services/logger");

class RolesLoader {
  static async loadDefaults() {
    logger.info("Loading default users to DB...");
    for (const u of defaultUsers) {
      try {
        const role = await Role.findOne({ name: u.role });
        if (!role) {
          const user = await User.create(u);
        }
      } catch (error) {
        logger.warn(`Error while creating user in DB: ${u.role}.`);
      }
    }
  }
}

module.exports = RolesLoader;
