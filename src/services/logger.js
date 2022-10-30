const config = require('../config');
const winston = require('winston');

const customLogsFormat = winston.format.printf(({ level, message, time }) => {
    return `${time} [${level}] ${message}`
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: {
        service: 'online-store-service',
        time: new Date().toISOString()
    },
    transports: [
        new winston.transports.File(config.logs.error),
        new winston.transports.File(config.logs.combined),
        new winston.transports.Console({ ...config.logs.console, format: customLogsFormat })
    ]
});

module.exports = logger;