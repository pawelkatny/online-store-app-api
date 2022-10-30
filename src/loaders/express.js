const path = require('path');
const express = require('express');
const config = require('../config');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const PermissionsLoader = require('./permissions');
const RolesLoader = require('./roles');
const RoutesLoader = require('./routes');

class ExpressLoader {
    constructor() {
        const app = express();

        //middleware
        app.use(express.static(`${process.cwd()}/src/public`));
        app.use(express.json());
        app.use(morgan('combined'), rfs.createStream(config.logs.access.file, {
            interval: config.logs.access.interval,
            path: config.logs.access.path
        }));

        //default roles and permissions
        PermissionsLoader.loadDefaults();
        RolesLoader.loadDefaults();
        
        //routes
        RoutesLoader.init(app);
        
        //error handling

        //resource not found

        //start server
        this.startServer(app);        
    }

    startServer(app) {
        this.server = app.listen(config.port, () => {
            console.log(`Server listening on port ${config.port}`);
        });
    }
}

module.exports = ExpressLoader;