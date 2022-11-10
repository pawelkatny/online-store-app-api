const { default: mongoose } = require('mongoose');
const { Customer } = require('../models/user');
const Product = require('../models/product');

class CustomerService {
    static async getInfo(userId) {
        return Customer.findById(userId);
    }

    static async getCart(userId) {
        return Customer.findById(userId, { cart: 1, _id: 0 });
    }

    static async addProductToCart(userId, productId) {
        const product = await Product.findById(productId);
        const customer = await Customer.findById(userId, { cart: 1});
        const cart = customer.cart;
        const cartProductIndex = cart.products.findIndex(p => p.product.toString() == productId);
        if (cartProductIndex >= 0) {
            cart.products[cartProductIndex].quantity += 1;
        } else {
            cart.products.push({
                name: product.name,
                product: product._id,
                price: product.price,
                quantity: 1
            });
        }
        await customer.updateCartTotal();
        
        return customer.save();
    }

    static async updateProductCartQty(userId, update) {
        const { qty, productId } = update;
        const customer = await Customer.findById(userId, { cart: 1});
        const cart = customer.cart;

        const cartProductIndex = cart.indexOf(p => p.product == productId);
        if (cartProductIndex >= 0 && qty > 0) {
            cart[cartProductIndex].quantity = qty;
        } 
        await customer.updateCartTotal();

        return customer.save();
    }

    static async removeProductFromCart(userId, productId) {
        const customer = await Customer.findById(userId, { cart: 1});
        const cart = customer.cart;
        const updatedCartProducts = cart.products.filter(p => p.product != productId);
        cart.products = updatedCartProducts;
        await customer.updateCartTotal();

        return customer.save();
    }

    static async clearCart(userId) {
        return Customer.findByIdAndUpdate(userId, {
            $set: { cart: {
                products: [],
                tota: 0
            }}
        });
    }

    static async getAddress(userId, addressId) {
        return Customer.findOne({
            _id: userId,
            "addresses._id": addressId
        }, { addresses: 1, _id: 0 });
    }

    static async getAddresses(userId) {
        return Customer.findById(userId, {
            addresses: 1,
            _id: 0
        });
    }

    static async addAddress(userId, addressData) {
        const addressId = new mongoose.Types.ObjectId().toString();
        if (!addressData.name) {

            const newAddressName = `${addressData.street.name}, ${addressData.city}`;
            addressData.name = newAddressName;
        }
        return Customer.findByIdAndUpdate(userId,
            { $push: { addresses: { ...addressData, _id: addressId } } },
            { returnOriginal: false });
    }

    static async updateAddress(userId, addressId, addressData) {
        console.log({ userId, addressId, addressData });
        return Customer.findOneAndUpdate({ _id: userId, "addresses._id": addressId },
            { $set: {
                "addresses.$.name": addressData.name,
                "addresses.$.street": addressData.street,
                "addresses.$.zipCode": addressData.zipCode,
                "addresses.$.city": addressData.city, 
                "addresses.$.country":  addressData.country,
            } },
            {
                returnOriginal: false,
                fields: {
                    addresses: 1
                }
            });
    }

    static async deleteAddress(userId, addressId) {
        return Customer.findByIdAndUpdate(userId, {
            $pull: {
                addresses: {
                    _id: addressId
                }
            }
        });
    }

    static async addProductToFav(userId, productId) {
        return Customer.findByIdAndUpdate(userId, { $addToSet: { favorites: productId }});
    }

    static async removeProductFromFav(userId, productId) {
        return Customer.findByIdAndUpdate(userId, { $pull: { favorites: productId }});
    }

    static async showFavProducts(userId) {  
        return Customer.findById(userId, { favorites: 1, _id: 0 })
        .populate({ 
            path: 'favorites',
            select: {
                name: 1,
                images: 1,
                price: 1,
                quantity: 1
            }
        });
    }
}

module.exports = CustomerService;