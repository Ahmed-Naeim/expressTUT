//Create JWTs
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization; //get the authorization header from the request
    //check if the authorization header is present and starts with Bearer
    if(!authHeader?.startsWith('Bearer')) return res.sendStatus(401); //Unauthorized
    const token = authHeader.split(' ')[1]; //Bearer token


    jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET, 
        (err, decoded) => {
        if(err) return res.sendStatus(403); //Forbidden
        req.user = decoded.UserInfo.username; //add the username to the request object
        req.roles = decoded.UserInfo.roles; //add the roles to the request object
        next(); //call the next middleware function
    });
};


 module.exports = verifyJWT; //export the middleware function