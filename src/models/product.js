const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required.'],
        unique: true,
        maxlength: 50
    },
    description: {
        type: String,
        required: [true, 'Product description is required.'],
        maxlength: 10000
    },
    additionalInfo: [{
        type: String,
        maxlength: 500
    }],
    tags: [String],
    images: [String],
    quantity: Number,
    price: Number,
    rating: {
        type: Number,
        default: null
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;