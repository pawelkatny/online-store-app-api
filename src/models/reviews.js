const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewer: {
        name: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        }
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    summary: {
        type: String,
        maxlength: 1000
    },
    rating: {
        type: Number,
        enum: [1,2,3,4,5],
        required: true
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;