const Permission = require('../models/permission');
const Role = require('../models/role');
const defaultRoles = require('../config/roles');

class RolesLoader {
    static async loadDefaults() {
        console.log('Loading default roles to DB...');
        for (const r of defaultRoles) {
            try {
                const permissions = await Permission.find({ 'tag' : { $in: r.permissions }});
                let role = await Role.findOne({ name: r.name });
                if (!role) {
                    role = await Role.create( { name: r.name, permissions: permissions });
                }
            } catch (error) {
                Console.log(`Error while creating role: ${r.name}`);
            }
        }
    }
}

module.exports = RolesLoader;