const Permission = require('../models/permission');
const defaultPermissions = require('../config/permissions');

class PermissionsLoader {
    static async loadDefaults() {
        console.log('Loading default permissions to DB...');
        for (const p of defaultPermissions) {
            try {
                let permission = await Permission.findOne({ tag: p.tag });
                if (!permission) {
                    permission = Permission.create({ ...p })
                }
            } catch (error) {
                console.log(`Error loading permission: ${p.tag}`);
            }
        }
    }
}

module.exports = PermissionsLoader;