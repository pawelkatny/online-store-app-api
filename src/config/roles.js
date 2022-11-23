const defaultRoles = [
    {
        name: 'admin',
        permissions: [
            'view-order',
            'view-payment',
            'view-cart',
            'view-user',
            'view-role',
            'view-permission',
            'view-return',
            'view-conversation',
            'edit-order',
            'edit-cart',
            'edit-role',
            'edit-permission',
            'edit-product',
            'edit-conversation',
            'edit-file',
            'edit-user',
            'edit-return'
        ]
    },
    {
        name: 'support',
        permissions: [
            'view-order',
            'view-payment',
            'view-cart',
            'view-user',
            'view-return',
            'view-conversation',
            'edit-product',
            'edit-conversation',
        ]
    },
    {
        name: 'customer',
        permissions: []
    }
];

module.exports = defaultRoles;
