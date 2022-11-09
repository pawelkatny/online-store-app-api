const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('async-jsonwebtoken');
const { jwt_secret } = require('../config');

const userSchema = new mongoose.Schema({
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },

    email: {
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email address.',
        ],
        required: [true, 'Please provide email address.'],
        maxlength: 50
    },

    password: {
        type: String,
        required: [true, 'Please provide password.']
    },

    name: {
        first: {
            type: String,
            required: [true, 'Please provide your first name.'],
            maxlength: 30
        },
        last: {
            type: String,
            required: [true, 'Please provide your last name.'],
            maxlength: 30
        }
    },

}, { timestamps: true });

userSchema.pre('save', async function () {
    const updatedFields = this.modifiedPaths();
    if (updatedFields.includes('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

userSchema.methods.comparePwd = async function (inputPwd) {
    const isMatch = await bcrypt.compare(inputPwd, this.password);
    return isMatch;
}

userSchema.methods.createToken = async function () {
    const [token, err] = await jwt.sign({ id: this._id }, jwt_secret, {
        expiresIn: '1d'
    });

    if (err) {
        throw new Error('Error while creating user token.');
    }

    return token;
}

const User = mongoose.model('User', userSchema);

const customerSchema = new mongoose.Schema({
    phone: {
        type: String,
        maxlength: 20
    },

    addresses: [
        {
            _id: String,
            name: {
                type: String,
                maxlength: 30
            },
            street: {
                name: {
                    type: String,
                    maxlength: 30
                },
                number: Number,
                localNumber: Number
            },
            zipCode: {
                type: String,
                maxlength: 30
            },
            city: {
                type: String,
                maxlength: 30
            },
            country: {
                type: String,
                maxlength: 50
            },
        }
    ],

    cart: {
        products: [
            {
                name: String,
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product"
                },
                price: Number,
                quantity: Number
            }
        ],
        total: Number
    },

    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],

    lastLoginDate: Date,

    failedLogins: {
        count: Number,
        lastDate: Date
    }
}, {
    discriminatorKey: 'type'
});

const Customer = User.discriminator('Customer', customerSchema);

module.exports = {
    User,
    Customer
}