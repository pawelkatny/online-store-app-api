const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required.'],
        unique: true,
        maxlength: 50
    },
    scientificName: {
        type: String,
        required: [true, 'Product scientific name is required.'],
        unique: true,
        maxlength: 50
    },
    family: {
        type: String,
        required: [true, 'Product family is required.'],
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
    tags: [{
        type: String,
        maxlength: 30
    }],
    images: [String],
    quantity: Number,
    price: Number,
    rating: {
        type: Number,
        default: null
    },
    reviews: [{
        rating: Number,
        review: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    }]
});

productSchema.methods.updateRating = async function () {
    const reviews = this.reviews;
    const sumRating = reviews.reduce((a, b) => {
        return a + b.rating;
    }, 0);

    this.rating = Number.parseFloat(sumRating/reviews.length).toFixed(1);
}

const Product = mongoose.model('Product', productSchema);

module.exports = Product;