const User =require('../model/User'); //import the User model
const bcrypt = require('bcrypt');

    //Create JWTs
    const jwt = require('jsonwebtoken');
const { stringify } = require('uuid');

const handleLogin = async (req, res) =>{
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON, stringify(cookies)}`);

    const {user, pwd} = req.body;

    if(!user || !pwd) return res.status(400).json({"message": "Username and Password are REQUIRED!!"});
    const foundUser = await User.findOne({username: user}).exec(); //findOne method returns a promise, so we need to use await to get the result
    if(!foundUser) return res.sendStatus(401); //Unauthorized

    //evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match){
        const roles = Object.values(foundUser.roles); //get the roles of the user (array of roles)
        //create a JWT to use with other routes which want to be protected in our api
        //normal token and refresh token
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username , //username of the user
                    "roles": roles //pass in the roles of the user (array of roles)

                } 
            }, //payload (username)
            process.env.ACCESS_TOKEN_SECRET, //secret key
            { expiresIn: '30s' } //token expiration time ==> in production make it longer 5-15 minutes
        ); //pass in the payload (username) and secret key

        const newRefreshToken = jwt.sign(
            { "username": foundUser.username }, //payload (username)
            process.env.REFRESH_TOKEN_SECRET, //secret key
            { expiresIn: '1d' } //token expiration time
        ); //pass in the payload (username) and secret key

        let newRefreshTokenArray = 
        !cookies?.jwt
            ? foundUser.refreshToken
            : foundUser.refreshToken.filter (rt => rt !== cookies.jwt);
        
            if (cookies?.jwt) {
                // Scenario:
                //1- User logs in bu never uses RT and doesn't logout
                //2- RT is stolen
                //3- If 1 & 2, reuse detection is needed to clear all RTs when user logs in
                
                const refreshToken = cookies.jwt;
                const foundToken = await User.findOne({refreshToken}).exec();

                if(!foundToken){
                    console.log('attempted refresh token reuse at login!');

                //clearout all previous refresh tokens
                newRefreshTokenArray = [];
                }
                
                res.clearCookie('jwt', {httpOnly: true, sameSite: 'None' , secure: 'true'}); //secure: true only if using https

            }


        //Saving refreshToken with current user in the database (in the json file)
        foundUser.refreshToken = [...newRefreshToken, newRefreshToken]; //add the refresh token to the user object
        const result = await foundUser.save(); //save the user object to the database
        console.log(result); //log the result to the console

        //NOTE: we store access token in the client (local storage or session storage) and send it with every request to the server

        //we send the refresh token to the client as a cookie (httpOnly) so it can't be accessed by javascript in the browser
        res.cookie('jwt', newRefreshToken, { //send the refresh token as a cookie
            httpOnly: true, //can't be accessed by javascript in the browser
            sameSite: 'None', //cross site cookie
            //secure: true,                                             //only send the cookie over https (in production)
            maxAge: 24 * 60 * 60 * 1000 //1 day in milliseconds
        }); //set the cookie with the refresh token and expiration time
        res.json({ accessToken }); //send the access token to the client
    }
    else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};