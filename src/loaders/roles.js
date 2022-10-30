const Permission = require('../models/permission');
const Role = require('../models/role');
const defaultRoles = require('../config/roles');
const logger = require('../services/logger');

class RolesLoader {
    static async loadDefaults() {
        logger.info('Loading default roles to DB...');
        for (const r of defaultRoles) {
            try {
                const permissions = await Permission.find({ 'tag' : { $in: r.permissions }});
                let role = await Role.findOne({ name: r.name });
                if (!role) {
                    role = await Role.create( { name: r.name, permissions: permissions });
                }
            } catch (error) {
                logger.warn(`Error while creating role in DB: ${r.name}.`);
            }
        }
    }
}

module.exports = RolesLoader;