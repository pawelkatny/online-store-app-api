require('dotenv').config({ path: `${process.cwd()}/src/.env` });
const path = require('path');
const workingDir = process.cwd();

const config = {
    api: {
        prefix: '/api/v1'
    },
    absPath: workingDir,
    env: process.env.NODE_ENV || 'development',
    dbUri: process.env.MONGO_URI,
    logs: {
        access: {
            file: 'access.log',
            interval: '1d',
            path: path.join(workingDir, 'src', 'logs', 'access')
        },
        error: {
            level: 'error',
            filename: path.join(workingDir, 'src', 'logs', 'error', 'error.log')
        },
        combined: {
            filename: path.join(workingDir, 'src', 'logs', 'error', 'combined.log')
        },
        console: {
            level: "debug",
            handleExceptions: true
        }
    },
    mongoOpts: {
        useNewUrlParser: true
    },
    port: process.env.PORT || 3000
}

module.exports = config;