const generatePwd = require("../helpers/passGenerator");

const defaultUsers = [
  {
    role: "admin",
    email: "admin@online-store.pl",
    name: {
      first: "admin",
      last: "admin",
    },
    password: generatePwd(),
  },
  {
    role: "support",
    email: "support@online-store.pl",
    name: {
      first: "support",
      last: "support",
    },
    password: generatePwd(),
  },
];

module.exports = defaultUsers;
