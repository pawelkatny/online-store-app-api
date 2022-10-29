const path = require('path');
const express = require('express');
const config = require('../config');
const RoutesLoader = require('./routes');

class ExpressLoader {
    constructor() {
        const app = express();



        //middleware
        app.use(express.static(`${process.cwd()}/src/public`));
        app.use(express.json());


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