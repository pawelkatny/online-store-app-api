const indexRoutes = require('../api/v1/routes/index');
const authRoutes = require('../api/v1/routes/auth');
const adminRoutes = require('../api/v1/routes/admin');
const userRoutes = require('../api/v1/routes/user');
const productRoutes = require('../api/v1/routes/product');
const orderRoutes = require('../api/v1/routes/order');

class RoutesLoader {
    static init(app) {
        app.use('/', indexRoutes);
        app.use('/auth', authRoutes);
        app.use('/admin', adminRoutes);
        app.use('/users', userRoutes);
        app.use('/products', productRoutes);
        app.use('/orders', orderRoutes);
    }
}

module.exports = RoutesLoader;