const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },

    reason: {
        type: String,
        maxlength: 500
    },

    status: {
        type: String,
        enum: [
            'Completed',
            'Cancelled',
            'Failed',
            'On hold',
            'Pending refund',
            'Processing',
            'Received'
        ],
        required: true
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
            total: Number,
            notes: {
                type: String,
                maxlength: 250
            }
        }
    ],

    total: Number
}, { timestamps: true });

returnSchema.pre('save', async function () {
    this.total = this.products.reduce((a, b) => a + b.total, 0);
});

const Return = mongoose.model('Return', returnSchema);

module.exports = Return;