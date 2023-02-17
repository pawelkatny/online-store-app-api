const defaultRoles = [
  {
    name: "admin",
    permissions: [
      "view-order",
      "view-cart",
      "view-user",
      "view-role",
      "view-permission",
      "view-return",
      "edit-order",
      "edit-cart",
      "edit-role",
      "edit-permission",
      "edit-product",
      "edit-user",
      "edit-return",
    ],
  },
  {
    name: "support",
    permissions: [
      "view-order",
      "view-payment",
      "view-cart",
      "view-user",
      "view-return",
      "edit-product",
      "edit-return",
      "edit-order",
      "edit-cart",
    ],
  },
  {
    name: "customer",
    permissions: [],
  },
];

module.exports = defaultRoles;
