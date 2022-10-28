const config = require('./config');
const mongoose = require('mongoose');
const ExpressLoader = require('./loaders/express');

try {
    mongoose.connect(config.dbUri, config.mongoOpts);
    const express = new ExpressLoader();
} catch (error) {
    console.log(error);
}
