const Product = require('../models/product');
const Review = require('../models/review');
const { Customer } = require('../models/user');

class ProductService {
    static async getProducts(query) {
        const { name, sort, family, scientificName, numeric } = query;
        const queryObject = {};
        
        if (name) {
            queryObject.name = { $regex: name, $options: 'i' };
        }

        if (family) {
            queryObject.family = { $regex: family, $options: 'i' };
        }

        if (scientificName) {
            queryObject.scientificName = { $regex: family, $options: 'i' };
        }

        if (numeric) {
            const options = {
                '>=': '$gte',
                '<=': '$lte',
                '>': '$gt',
                '<': '$lt'
            }
            const numericFilters = Array.isArray(numeric) ? numeric : [numeric];
            numericFilters.forEach(nf => {
                const match = nf.match(/>=|<=|>|</);
                if(match) {
                    const filterParams = nf.split(match[0]);
                    const queryFields = {};
                    queryFields[options[match[0]]] = filterParams[1];

                    if (!queryObject[filterParams[0]]) {
                        queryObject[filterParams[0]] = {};
                    }
                    
                    Object.assign(queryObject[filterParams[0]], queryFields);
                }
            })
        }

        const products = Product.find(queryObject);

        if (sort) {
            const [ option, type ] = sort.split('#');
            const sortObject = {};
            sortObject[option] = type;
            products.sort(sortObject);
        }

        return products;
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