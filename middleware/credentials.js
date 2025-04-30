const allowedOrigins = require('../config/allowedOrigins'); //import the allowed origins from the config file

const credentials = (req, res, next) => {
    const origin = req.headers.origin; //get the origin of the request

    if (allowedOrigins.includes(origin)) { //check if the origin is in the allowed origins
        res.setHeader('Access-Control-Allow-Credentials', true); //set the header to allow credentials
    }
    next(); //move to the next middleware
};

module.exports = credentials;