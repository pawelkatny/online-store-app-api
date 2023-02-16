const generatePwd = require("../helpers/passGenerator");

const defaultUsers = [
  {
    role: "admin",
    email: "admin@online-store.pl",
    name: {
      firstName: "admin",
      lastName: "admin",
    },
    password: generatePwd(),
  },
  {
    role: "support",
    email: "support@online-store.pl",
    name: {
      firstName: "support",
      lastName: "support",
    },
    password: generatePwd(),
  },
];

module.exports = defaultUsers;
