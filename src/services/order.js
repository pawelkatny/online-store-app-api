const Order = require("../models/order");
const Product = require("../models/product");
const MailerService = require("./mailer");

class OrderService {
  static async createOrder(userData, orderData) {
    const { delivery, address, products } = orderData;
    const status = {
      success: false,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    };
    const today = new Date().toDateString("default", {
      month: "short",
      year: "long",
    });
    const currentMonth = today.split(" ")[1];
    const currentYear = today.split(" ")[3];
    const lastCurrentMonthOrder = await Order.findOne({
      number: { $regex: `/${currentMonth}/` },
    });
    let index = 1;
    if (lastCurrentMonthOrder) {
      const lastOrderNumber = lastCurrentMonthOrder.name;
      const lastIndex = lastOrderNumber.split(`/${currentMonth}`)[0];
      index = lastIndex + 1;
    }
    const orderNumber = `${index}/${currentMonth}/${currentYear}`;

    const updatedProducts = await Promise.all(
      products.map(async (p) => {
        const productId = p.product;
        const product = await Product.findById(productId, { price: 1, _id: 0 });
        p.price = product.price;
        p.total = p.quantity * product.price;
        return p;
      })
    );

    const orderData = {
      number: orderNumber,
      customer: {
        ...userData,
      },
      status: "Processing",
      delivery: delivery,
      address: address,
      products: updatedProducts,
      total: orderTotal,
    };

    const order = await Order.create(orderData);

    if (order) {
      const mailer = new MailerService();
      await mailer.createTransporter();
      const emailOptions = {
        header: {
          to: email,
          subject: "Order confirmation",
        },
        template: "order-confirmation",
        context: {
          companyName: "TESTING PRODUCT",
          name: orderData.customer.name.first,
          products: orderData.products,
          orderTotal: orderData.total,
          shippingInfo: orderData.delivery,
        },
      };
      const emailStatus = await mailer.sendEmail(emailOptions);

      if (emailStatus.messageId) {
        status.success = true;
        status.code = StatusCodes.CREATED;
      }
    }

    return status;
  }

  static async updateOrder(id, orderData) {
    return Order.findByIdAndUpdate(id, { ...orderData }, { new: true });
  }

  static async getOrders(query) {
    const { number, email, firstName, lastName, sort, numeric } = query;
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

    const orders = Order.find(queryObject);

    if (sort) {
      const [option, type] = sort.split("#");
      const sortObject = {};
      sortObject[option] = type;
      orders.sort(sortObject);
    }

    return orders;
  }

  static async getOrderById(orderId) {
    return Order.findById(orderId);
  }

  static async getOrder(params) {
    return Order.findOne(params);
  }
}

module.exports = OrderService;
