const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
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

    order: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
    },

    reason: {
      type: String,
      maxlength: 500,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Completed",
        "Cancelled",
        "Failed",
        "On hold",
        "Pending refund",
        "Processing",
        "Received",
      ],
      required: true,
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
        notes: {
          type: String,
          maxlength: 250,
        },
      },
    ],

    total: Number,
  },
  { timestamps: true }
);

returnSchema.pre("save", async function () {
  this.total = this.products.reduce((a, b) => a + b.total, 0);
});

const Return = mongoose.model("Return", returnSchema);

module.exports = Return;
