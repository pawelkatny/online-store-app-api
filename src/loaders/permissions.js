const Permission = require('../models/permission');
const defaultPermissions = require('../config/permissions');
const logger = require('../services/logger');

class PermissionsLoader {
    static async loadDefaults() {
        logger.info('Loading default permissions to DB...');
        for (const p of defaultPermissions) {
            try {
                let permission = await Permission.findOne({ tag: p.tag });
                if (!permission) {
                    permission = Permission.create({ ...p })
                }
            } catch (error) {
                logger.warn(`Error while creating permission in DB: ${p.name}.`);
            }
        }
    }
}

module.exports = PermissionsLoader;