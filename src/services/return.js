const Return = require('../models/return');
const Order = require('../models/order');

class ReturnService {
    static async createReturn(customerId, returnData) {
        const { orderId, products, reason } = returnData;

        //get order data 
        const order = await Order.findById(orderId, { number: 1 , products: 1 });
        //get returns connected to order and map to products
        const returns = await Return.find({ order: orderId }).populate('order').sort({ createdAt: 'desc' });
        //check if items were already returned
        let returnedProducts = [];

        if (returns.length == 0) {
            products.forEach(p => {
                const productOrder = order.products.find(po => po.product == p.productId);
                if (productOrder) {
                    returnedProducts.push({
                        ...p, 
                        returnedQty: 0,
                        orderQty: productOrder.quantity,
                        name: productOrder.name,
                        price: productOrder.price 
                    });
                }
            });
        }

        if (returns.length > 0) {
            returns.forEach(r => {
                products.forEach(p => {
                    const productReturn = r.products.find(pr => pr.product == p.productId);
                    const productOrder = order.products.find(po => po.product == p.productId);
                    //check if product exists on order
                    const returnedProductIndex = returnedProducts.findIndex(rp => rp.productId == p.productId);
                    console.log(returnedProductIndex)
                    if (returnedProductIndex < 0) {
                        console.log('test')
                        returnedProducts.push(
                            {
                                ...p,
                                returnNumber: r.number,
                                returnId: r._id,
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
        }

        const productsToReturn = returnedProducts.map(rp => {
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
        });

        const eligibleForReturn = productsToReturn.filter(rp => rp.canBeReturned == true);

        const ineligibleForReturn = productsToReturn.filter(rp => rp.canBeReturned != true);

        //create default object to return from function
        const returnCreationStatus = {
            success: false,
            return: null,
        }

        //create return number
        let returnNumber = `R/${order.number}/1`;
        if (returns.length > 0) {
            const lastReturnId = returns[0].number.split('/')[4];
            returnNumber = `R/${order.number}/${+lastReturnId + 1}`;
        }

        if (eligibleForReturn.length > 0) {
            const returnData = {
                number: returnNumber,
                customer: customerId,
                order: orderId,
                reason: reason,
                status: 'Processing',
                products: eligibleForReturn.map(ra => {
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

            const newReturn = await Return.create(returnData);
            returnCreationStatus.success = true;
            returnCreationStatus.return = newReturn;
        }
        
        if (ineligibleForReturn.length > 0) {
            returnCreationStatus.ineligibleForReturn = ineligibleForReturn;
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