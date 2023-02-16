const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("async-jsonwebtoken");
const { jwt_secret } = require("../config");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },

    email: {
      type: String,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email address.",
      ],
      required: [true, "Please provide email address."],
      maxlength: 50,
    },

    password: {
      type: String,
      required: [true, "Please provide password."],
      maxlength: 20,
    },

    passwordReset: {
      token: String,
      createdAt: Date,
    },

    name: {
      first: {
        type: String,
        required: [true, "Please provide your first name."],
        maxlength: 30,
      },
      last: {
        type: String,
        required: [true, "Please provide your last name."],
        maxlength: 30,
      },
    },

    phone: {
      type: String,
      maxlength: 20,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const updatedFields = this.modifiedPaths();
  if (updatedFields.includes("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.comparePwd = async function (inputPwd) {
  const isMatch = await bcrypt.compare(inputPwd, this.password);
  return isMatch;
};

userSchema.methods.createToken = async function () {
  const [token, err] = await jwt.sign({ id: this._id }, jwt_secret, {
    expiresIn: "30d",
  });

  if (err) {
    throw new Error("Error while creating user token.");
  }

  return token;
};

userSchema.methods.createResetPwdToken = async function () {
  const token = new mongoose.Types.ObjectId();
  this.passwordReset = {
    token: token,
    createdAt: Date.now(),
  };
};

userSchema.methods.deleteResetPwdToken = async function () {
  this.passwordReset.token = null;
};

const User = mongoose.model("User", userSchema);

const customerSchema = new mongoose.Schema(
  {
    active: {
      type: Boolean,
      default: false,
    },

    addresses: [
      {
        _id: String,
        name: {
          type: String,
          maxlength: 30,
        },
        street: {
          name: {
            type: String,
            maxlength: 30,
          },
          number: Number,
          localNumber: Number,
        },
        zipCode: {
          type: String,
          maxlength: 30,
        },
        city: {
          type: String,
          maxlength: 30,
        },
        country: {
          type: String,
          maxlength: 50,
        },
        default: {
          type: Boolean,
          default: false,
        },
      },
    ],

    cart: {
      products: [
        {
          name: String,
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          price: Number,
          quantity: Number,
        },
      ],
      total: Number,
    },

    favorites: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
    },

    accountActivation: {
      token: String,
      createdAt: Date,
    },

    expireAt: {
      type: Date,
      default: new Date(new Date().valueOf() + 604800000),
      expires: 60,
    },
  },
  {
    discriminatorKey: "type",
    timestamps: true,
  }
);

customerSchema.methods.updateCartTotal = async function () {
  const cartProducts = this.cart.products;
  const cartTotal = cartProducts.reduce((a, b) => a + b.quantity * b.price, 0);
  this.cart.total = cartTotal;
};

customerSchema.methods.createActivationToken = async function () {
  const token = new mongoose.Types.ObjectId();
  this.accountActivation = {
    token: token,
    createdAt: Date.now(),
  };
};

const Customer = User.discriminator("Customer", customerSchema);

module.exports = {
  User,
  Customer,
};
