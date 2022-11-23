const indexRoutes = require('../api/v1/routes/index');
const authRoutes = require('../api/v1/routes/auth');
const adminRoutes = require('../api/v1/routes/admin');
const userRoutes = require('../api/v1/routes/user');
const productRoutes = require('../api/v1/routes/product');
const orderRoutes = require('../api/v1/routes/order');
const returnRoutes = require('../api/v1/routes/return');
const CustomError = require('../error/customError');
const { api: {
    prefix
} } = require('../config');

class RoutesLoader {
    static init(app) {
        app.use(`${prefix}`, indexRoutes);
        app.use(`${prefix}/auth`, authRoutes);
        app.use(`${prefix}/admin`, adminRoutes);
        app.use(`${prefix}/users`, userRoutes);
        app.use(`${prefix}/products`, productRoutes);
        app.use(`${prefix}/orders`, orderRoutes);
        app.use(`${prefix}/returns`, orderRoutes);
        app.use('*', (req, res, next) => {
            const err = new CustomError('Not found', 404);
            next(err);
        })
    }
}

module.exports = RoutesLoader;