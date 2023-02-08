const Return = require("../models/return");
const Order = require("../models/order");
const { Customer } = require("../models/user");
const CustomError = require("../error/customError");
const { StatusCodes } = require("http-status-codes");

class ReturnService {
  static async createReturn(customerId, returnData) {
    const { orderId, products, reason } = returnData;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      throw new CustomError("User not found", StatusCodes.NOT_FOUND);
    }

    const order = await Order.findById(orderId, { number: 1, products: 1 });

    const returns = await Return.find({
      "order.id": orderId,
      status: { $nin: ["Cancelled", "Failed"] },
    })
      .populate("order")
      .sort({ createdAt: "desc" });

    let returnedProducts = [];

    if (returns.length == 0) {
      products.forEach((p) => {
        const productOrder = order.products.find(
          (po) => po.product == p.productId
        );
        if (productOrder) {
          returnedProducts.push({
            ...p,
            returnedQty: 0,
            orderQty: productOrder.quantity,
            name: productOrder.name,
            price: productOrder.price,
          });
        }
      });
    }

    if (returns.length > 0) {
      returns.forEach((r) => {
        products.forEach((p) => {
          const productReturn = r.products.find(
            (pr) => pr.product == p.productId
          );
          const productOrder = order.products.find(
            (po) => po.product == p.productId
          );
          //check if product exists on order
          const returnedProductIndex = returnedProducts.findIndex(
            (rp) => rp.productId == p.productId
          );
          if (returnedProductIndex < 0) {
            returnedProducts.push({
              ...p,
              returnNumber: r.number,
              returnId: r._id,
              returnedQty: productReturn.quantity,
              orderQty: productOrder.quantity,
              name: productOrder.name,
              price: productOrder.price,
            });
          } else {
            returnedProducts[returnedProductIndex].returnedQty +=
              productReturn.quantity;
          }
        });
      });
    }

    const productsToReturn = returnedProducts.map((rp) => {
      const qtyToReturn = rp.qty;
      const availableQtyToReturn = rp.orderQty - rp.returnedQty;
      let canBeReturned = false;
      if (availableQtyToReturn - qtyToReturn >= 0) {
        canBeReturned = true;
      }

      return {
        ...rp,
        canBeReturned,
      };
    });

    const eligibleForReturn = productsToReturn.filter(
      (rp) => rp.canBeReturned == true
    );

    const ineligibleForReturn = productsToReturn.filter(
      (rp) => rp.canBeReturned != true
    );

    const returnCreationStatus = {
      success: false,
      return: null,
    };

    let returnNumber = `R/${order.number}/1`;
    if (returns.length > 0) {
      const lastReturnId = returns[0].number.split("/")[4];
      returnNumber = `R/${order.number}/${+lastReturnId + 1}`;
    }

    if (eligibleForReturn.length > 0) {
      const returnData = {
        number: returnNumber,
        customer: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
        },
        order: {
          id: order._id,
          number: order.number,
        },
        reason: reason,
        status: "Processing",
        products: eligibleForReturn.map((ra) => {
          return {
            name: ra.name,
            product: ra.productId,
            quantity: ra.qty,
            price: ra.price,
            total: ra.price * ra.qty,
            notes: ra.notes,
          };
        }),
      };

      const newReturn = await Return.create(returnData);
      returnCreationStatus.success = true;
      returnCreationStatus.return = newReturn;
    }

    if (ineligibleForReturn.length > 0) {
      returnCreationStatus.ineligibleForReturn = ineligibleForReturn;
    }

    return returnCreationStatus;
  }

  static async getReturns(query) {
    const {
      number,
      email,
      firstName,
      lastName,
      reason,
      status,
      sort,
      numeric,
    } = query;
    const queryObject = {};

    if (number) {
      queryObject.number = { $regex: number, $options: "i" };
    }

    if (email) {
      queryObject["customer.email"] = { $regex: email, $options: "i" };
    }

    if (firstName) {
      queryObject["customer.name.firstName"] = {
        $regex: firstName,
        $options: "i",
      };
    }

    if (lastName) {
      queryObject["customer.name.lastName"] = {
        $regex: lastName,
        $options: "i",
      };
    }

    if (reason) {
      queryObject.reason = { $regex: reason, $options: "i" };
    }

    if (status) {
      queryObject.status = { $regex: status, $options: "i" };
    }

    if (numeric) {
      const options = {
        ">=": "$gte",
        "<=": "$lte",
        ">": "$gt",
        "<": "$lt",
      };
      const numericFilters = Array.isArray(numeric) ? numeric : [numeric];
      numericFilters.forEach((nf) => {
        const match = nf.match(/>=|<=|>|</);
        if (match) {
          const filterParams = nf.split(match[0]);
          const queryFields = {};
          queryFields[options[match[0]]] = filterParams[1];

          if (!queryObject[filterParams[0]]) {
            queryObject[filterParams[0]] = {};
          }

          Object.assign(queryObject[filterParams[0]], queryFields);
        }
      });
    }

    const returns = Return.find(queryObject);

    if (sort) {
      const [option, type] = sort.split("#");
      const sortObject = {};
      sortObject[option] = type;
      returns.sort(sortObject);
    }

    return returns;
  }

  static async updateReturn(id, returnData) {
    return Return.findByIdAndUpdate(id, { ...returnData }, { new: true });
  }

  static async getReturn(returnId) {
    return Return.findById(returnId);
  }

  static async getCustomerReturn(customerId, returnId) {
    return Return.findOne({ _id: returnId, customer: customerId });
  }
}

module.exports = ReturnService;
