const Return = require('../models/return');
const Order = require('../models/order');

class ReturnService {
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

        //create default object to return from function
        const returnCreationStatus = {
            success: false,
            returnData: null,
        }

        //create return number
        let returnNumber = `R/${order.number}/1`;
        if (returns.length > 0) {
            const lastReturnId = returns[0].number.split('/')[4];
            returnNumber = `R/${order.number}/${lastReturnId + 1}`;
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
                })
            }

            returnCreationStatus.status = true;
            returnCreationStatus.returnData = newReturn;
        }
        
        return returnCreationStatus;
    }

    static async getReturns(params) {
        return Return.find(params);
    }

    static async getReturn(returnId) {
        return Return.findById(returnId);
    }
}

module.exports = ReturnService;