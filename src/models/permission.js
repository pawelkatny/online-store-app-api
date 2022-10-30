const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide name for new permission.'],
        maxlength: 50
    },

    description: {
        type: String,
        required: [true, 'Please provide description for new permission.'],
        maxlength: 100
    },

    tag: {
        type: String,
        required: [true, 'Permission tag field is required.'],
        maxlength: 50
    }
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissionSchema);