const Product = require('../models/product');
const Review = require('../models/review');
const { Customer } = require('../models/user');
const CustomError = require('../error/customError');

class ProductService {
    static async getProducts(params) {
        return Product.find(params);
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

        const review = Review.create(review);
        
        product.reviews.push({
            rating: rating,
            review: review._id
        });
        product.updateRating();

        return product.save();
    } 
}

module.exports = ProductService;