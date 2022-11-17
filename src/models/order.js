const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    status: {
        type: String,
        enum: [
            'Completed',
            'Cancelled',
            'Failed',
            'On hold',
            'Pending payment',
            'Processing',
            'Refunded',
            'Shipped'
        ],
        required: true
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    delivery: {
        type: String,
        enum: ['Inpost', 'UPS', 'DHL'],
        required: true
    },
    address: {
        name: {
            type: String,
            maxlength: 50
        },
        street: {
            name: {
                type: String,
                maxlength: 50
            },
            number: {
                type: String, 
                maxlength: 20
            },
            localNumber: {
                type: String, 
                maxlength: 20 
            }
        },
        city: {
            type: String,
            maxlength: 50
        },
        country: {
            type: String,
            maxlength: 50
        }
    },
    products: [
        {
            name: String,
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
            },
            quantity: Number,
            price: Number,
            total: Number
        }
    ],
    total: Number,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;