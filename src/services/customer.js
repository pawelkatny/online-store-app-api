const { default: mongoose } = require('mongoose');
const { Customer } = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');
const Return = require('../models/return');


class CustomerService {
    static async getSummary(userId) {
        const user = await Customer.findById(userId, {
            name: 1,
            phone: 1,
            email: 1,
            addresses: 1,
            _id: 0
        });
        const lastOrder = await Order.findOne({
            customer: userId
        },
            {
                number: 1,
                createdAt: 1,
                total: 1,
                status: 1
            })
            .sort({ createdAt: 'desc' })
            .limit(1);
        user.lastOrder = 'test';

        return { ...user._doc, lastOrder };
    }

    static async getInfo(userId) {
        const user = await Customer.findById(userId, {
            name: 1,
            phone: 1,
            email: 1,
            addresses: 1,
            _id: 0
        });

        return user;
    }

    static async updateInfo(userId, userData) {
        const { name, email, phone } = userData;

        return Customer.findOneAndUpdate({
            _id: userId,
            $or: [
                { name: { $ne: name } },
                { email: { $ne: email } },
                { phone: { $ne: phone } }
            ]
        },
            {
                $set: {
                    name: name,
                    email: email,
                    phone: phone
                }
            },
            {
                new: true
            }
        ).select({
            _id: 0,
            name: 1,
            email: 1,
            phone: 1
        });
    }

    static async getCart(userId) {
        return Customer.findById(userId, { cart: 1, _id: 0 });
    }

    static async addProductToCart(userId, productId) {
        const product = await Product.findById(productId);
        const customer = await Customer.findById(userId, { cart: 1 });
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

    static async updateProductCartQty(userId, productId, qty) {
        const customer = await Customer.findById(userId, { cart: 1 });
        const cart = customer.cart;

        const cartProductIndex = cart.products.findIndex(p => p.product == productId);
        if (cartProductIndex >= 0 && qty > 0) {
            cart.products[cartProductIndex].quantity = qty;
        }
        await customer.updateCartTotal();

        return customer.save();
    }

    static async removeProductFromCart(userId, productId) {
        const customer = await Customer.findById(userId, { cart: 1 });
        const cart = customer.cart;
        const updatedCartProducts = cart.products.filter(p => p.product != productId);
        cart.products = updatedCartProducts;
        await customer.updateCartTotal();

        return customer.save();
    }

    static async clearCart(userId) {
        return Customer.findByIdAndUpdate(userId, {
            $set: {
                cart: {
                    products: [],
                    total: 0
                }
            }
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
        const user = await Customer.findById(userId, { adddresses: 1 });
        if (!addressData.name) {

            const newAddressName = `${addressData.street.name}, ${addressData.city}`;
            addressData.name = newAddressName;
        }

        if (user.addresses.length == 0) {
            addressData.default = true;
        }

        return Customer.findByIdAndUpdate(userId,
            { $push: { addresses: { ...addressData, _id: addressId } } },
            { returnOriginal: false });
    }

    static async updateAddress(userId, addressId, addressData) {
        console.log({ userId, addressId, addressData });
        return Customer.findOneAndUpdate({ _id: userId, "addresses._id": addressId },
            {
                $set: {
                    "addresses.$.name": addressData.name,
                    "addresses.$.street": addressData.street,
                    "addresses.$.zipCode": addressData.zipCode,
                    "addresses.$.city": addressData.city,
                    "addresses.$.country": addressData.country,
                }
            },
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
        return Customer.findByIdAndUpdate(userId, { $addToSet: { favorites: productId } });
    }

    static async removeProductFromFav(userId, productId) {
        return Customer.findByIdAndUpdate(userId, { $pull: { favorites: productId } });
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

    static async checkout(userId) {
        let isCartEmpty = false;
        const user = await Customer.findById(userId, { cart: 1, addresses: 1 });
        const shipMethods = Order.schema.path('delivery').enumValues;

        if (!user || user.cart.products.length == 0) {
            isCartEmpty = true;
        }

        return {
            isEmpty: isCartEmpty,
            products: user.cart.products,
            total: user.cart.total,
            addresses: user.addresses,
            shipMethods: shipMethods
        }
    }

    static async showOrdersHistory(customerId) {
        return Order.find({ customer: customerId }).sort({ createdAt: 'desc' });
    }

    static async showOrder(customerId, orderId) {
        return Order.findOne({ _id: orderId, customer: customerId });
    }

    static async createReturn(customerId, returnData) {
        const { orderId, products, reason } = returnData;

        //get order data 
        const order = await Order.findById(orderId, { number: 1 });
        //get returns connected to order and map to products
        const returns = await Return.find({ order: orderId }).populate('order').sort({ createdAt: 'desc' });

        //check if items were already returned
        let returnedProducts;
        returns.forEach(r => {
            products.forEach(p => {
                const productReturn = r.products.find(pr => pr.product == p.productId);
                const productOrder = r.order.products.find(po => po.products.product == p.productId);
                //check if product exists on order
                const returnedProductIndex = returnedProducts.findIndex(rp => rp.productId == p.productId);
                if (!returnedProductIndex) {
                    returnedProducts.push(
                        {
                            ...p,
                            returnedQty: productReturn.quantity,
                            orderQty: productOrder.quantity,
                            name: productOrder.name,
                            price: productOrder.price
                        }
                    );
                } else {
                    returnedProducts[returnedProductIndex].returnedQty += productReturn.quantity; 
                }
                 
            });
        });

        const returnAvailability = returnedProducts.map(rp => {
            const qtyToReturn = rp.qty;
            const availableQtyToReturn = rp.orderQty - rp.returnedQty;
            let canBeReturned = false;
            if (availableQtyToReturn - qtyToReturn >= 0 ) {
                canBeReturned = true;
            }

            return {
                ...rp,
                canBeReturned
            }
        }).filter(rp => rp.canBeReturned == true);
        //pass - create return - not - return error

        //create return number
        let returnNumber = `R/${order.number}/1`;
        if (returns.length > 0) {
            const lastReturnId = returns[0].number.split('/')[4];
            returnNumber = `R/${order.number}/${lastReturnI + 1}`;
        }

        if (returnAvailability.length > 0) {
            const newReturn = {
                number: returnNumber,
                customer: customerId,
                order: orderId,
                reason: reason,
                status: 'Processing',
                products: returnAvailability.map(ra => {
                    return {
                        name: ra.name,
                        product: ra.productId,
                        quantity: ra.qty,
                        price: ra.price,
                        total: ra.price * ra.qty,
                        notes: ra.notes
                    }
                });
            }
            return Return.create({ ...newReturn });
        }
        
        return null;
    }
}

module.exports = CustomerService;