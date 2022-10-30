const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Please provide name for new role.'],
        maxlength: 30
    },

    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission"
    }]
}, { timestamps: true });