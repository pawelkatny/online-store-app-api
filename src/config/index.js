require('dotenv').config({ path: `${process.cwd()}/src/.env`});

const config = {
    api: {
        prefix: '/api/v1'
    },
    env: process.env.NODE_ENV || 'development',
    dbUri: process.env.MONGO_URI,
    mongoOpts: {
        useNewUrlParser: true
    },
    port: process.env.PORT || 3000
}

module.exports = config;