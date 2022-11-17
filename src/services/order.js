const Order = require('../models/order');
const Product = require('../models/product');

class OrderService {
    static async createOrder (customerId, orderData) {
        const { delivery, address, products } = orderData;
        const today = new Date().toDateString('default', { month: 'short', year: 'long' });
        const currentMonth = today.split(' ')[1];
        const currentYear = today.split(' ')[3];
        const lastCurrentMonthOrder = await Order.findOne({ number: {$regex: `/${currentMonth}/`}});
        let index = 1;
        if (lastCurrentMonthOrder) {
            const lastOrderNumber = lastCurrentMonthOrder.name;
            const lastIndex = lastOrderNumber.split(`/${currentMonth}`)[0];
            index = lastIndex + 1;
        }
        const orderNumber = `${index}/${currentMonth}/${currentYear}`;

        const updatedProducts = await Promise.all(products.map(async p => {
            const productId = p.product;
            const product = await Product.findById(productId, { price: 1, _id: 0});
            p.price = product.price;
            p.total = p.quantity * product.price;
            return p;
        }));

        const orderTotal = updatedProducts.reduce((a, b) => a + b.total, 0);

        const newOrder = {
            number: orderNumber,
            customer: customerId,
            status: 'Processing',
            delivery: delivery,
            address: address,
            products: updatedProducts,
            total: orderTotal
        }

        return Order.create(newOrder);
    }

    static async getOrders(params) {
        return Order.find(params);
    }

    static async getOrder(orderId) {
        return Order.findById(orderId);
    }


}

module.exports = OrderService; 