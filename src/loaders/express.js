require('express-async-errors');
const path = require('path');
const express = require('express');
const config = require('../config');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const logger = require('../services/logger');
const PermissionsLoader = require('./permissions');
const RolesLoader = require('./roles');
const RoutesLoader = require('./routes');
const errorHandler = require('../error/errorHandler');

class ExpressLoader {
    constructor() {
        const app = express();

        //middleware
        app.use(express.static(`${process.cwd()}/src/public`));
        app.use(express.json());
        app.use(morgan('combined', { stream: rfs.createStream(config.logs.access.file, {
            interval: config.logs.access.interval,
            path: config.logs.access.path
        })}));

        //default roles and permissions
        PermissionsLoader.loadDefaults();
        RolesLoader.loadDefaults();
        
        //routes
        RoutesLoader.init(app);
        
        //error handling
        app.use(errorHandler);
        //resource not found

        //start server
        this.startServer(app);        
    }

    startServer(app) {
        this.server = app.listen(config.port, () => {
            logger.log('info', `Server listening on port ${config.port}`);
        });
    }
}

module.exports = ExpressLoader;