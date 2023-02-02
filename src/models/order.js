const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
    },
    customer: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
      },
      name: {
        first: {
          type: String,
          maxlength: 30,
        },
        last: {
          type: String,
          maxlength: 30,
        },
      },
      email: {
        type: String,
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please provide a valid email address.",
        ],
        maxlength: 50,
      },
    },
    status: {
      type: String,
      enum: [
        "Completed",
        "Cancelled",
        "Failed",
        "On hold",
        "Pending payment",
        "Processing",
        "Refunded",
        "Shipped",
      ],
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    delivery: {
      type: String,
      enum: ["Inpost", "UPS", "DHL"],
      required: true,
    },
    address: {
      name: {
        type: String,
        maxlength: 50,
      },
      street: {
        name: {
          type: String,
          maxlength: 50,
        },
        number: {
          type: String,
          maxlength: 20,
        },
        localNumber: {
          type: String,
          maxlength: 20,
        },
      },
      city: {
        type: String,
        maxlength: 50,
      },
      country: {
        type: String,
        maxlength: 50,
      },
    },
    products: [
      {
        name: String,
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        price: Number,
        total: Number,
        deleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    total: Number,
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", async function () {
  const orderTotal = this.products
    .filter((p) => p.deleted != true)
    .reduce((a, b) => a + b.total, 0);
  this.total = orderTotal;
});

orderSchema.pre("findOneAndUpdate", async function () {
  const { products } = this._update;
  if (products) {
    products.forEach((p) => {
      p.total = p.price * p.quantity;
    });
    const orderTotal = products
      .filter((p) => p.deleted != true)
      .reduce((a, b) => a + b.total, 0);

    this._update.products = products;
    this._update.total = orderTotal;
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
