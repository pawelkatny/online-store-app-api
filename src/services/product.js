const Product = require('../models/product');

class ProductService {
    static async getProducts(params) {
        return Product.find(params);
    }

    static getProduct(productId) {
        return Product.findById(productId);
    }

    static createProduct(productData) {
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

    static updateProduct(productId, productData) {
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

    static deleteProduct(productId) {
        return Product.findByIdAndDelete(productId);
    }

}

module.exports = ProductService;