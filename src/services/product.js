const Product = require('../models/product');
const Review = require('../models/review');
const { Customer } = require('../models/user');

class ProductService {
    static async getProducts(query) {
        const { name } = query;
        const queryObject = {};
        
        if (query.name) {
            queryObject.name = { $regex: name, $options: 'i' };
        }

        return Product.find(queryObject);
    }

    static async getProduct(productId) {
        return Product.findById(productId);
    }

    static async createProduct(productData) {
        const { name, description, additionalInfo, tags, quantity, price } = productData;
        return Product.create({
            name,
            description,
            additionalInfo,
            tags,
            quantity,
            price
        });
    }

    static async updateProduct(productId, productData) {
        const { name, description, additionalInfo, tags, quantity, price } = productData;
        return Product.findByIdAndUpdate(productId, {
            name,
            description,
            additionalInfo,
            tags,
            quantity,
            price
        });
    }

    static async deleteProduct(productId) {
        return Product.findByIdAndDelete(productId);
    }

    static async addReview(productId, customerId, reviewData) {
        const { rating, summary } = reviewData;
        const customer = await Customer.findById(customerId); 
        const product = await Product.findById(productId);

        
        const newReview = {
            reviewer: {
                name: customer.name.first,
                customer: customerId
            },
            product: productId,
            summary: summary,
            rating: rating
        };

        const review = Review.create({ ...newReview });
        
        product.reviews.push({
            rating: rating,
            review: review._id
        });
        product.updateRating();

        return product.save();
    }
    
    static async getReviews(productId) {
        return Review.find({ product: productId }, { 
            'reviewer.name': 1,
            summary: 1,
            rating: 1
        });
    }

    static async getReview(productId, userId) {
        return Review.findOne({
            product: productId,
            'reviewer.customer': userId
        });
    }
}

module.exports = ProductService;