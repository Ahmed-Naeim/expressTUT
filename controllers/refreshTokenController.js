const User = require('../model/User'); //import the User model

//Create JWTs
const jwt = require('jsonwebtoken');


const handleRefreshToken =  async (req, res) =>{
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.sendStatus(401); //(unauthorized) check if has a cookie then check if there is a jwt property
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None' , secure: 'true'}); //secure: true only if using https


    const foundUser = await User.findOne({refreshToken}).exec(); //findOne method returns a promise, so we need to use await to get the result
    
    //Detected refresh token reuse!!!
    if(!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) =>{
                if(err) return res.sendStatus(403); //forbidden
                console.log('attempted refresh token reuse!!');
                const hackedUser = await User.findOne ({username: decoded.username}).exec();
                hackedUser.refreshToken = []; //delete all the refresh tokens of this user
                const result = await hackedUser.save();
                console.log(result);
            });
        return res.sendStatus(403); //forbidden
    } 

    const newRefreshTokenArray = foundUser.refreshToken.filter (rt => rt !== refreshToken);

    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) =>{
            if(err){
                console.log('expired refresh token');
                //updating the database
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
                console.log(result);
            }
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403);
            
            //Refresh Token is still valid
            const roles = Object.values(foundUser.roles); //get the roles of the user (array of roles)
            //create a JWT to use with other routes which want to be protected in our api
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles //pass in the roles of the user (array of roles)
                    }
            },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );

            const newRefreshToken = jwt.sign(
                { "username": foundUser.username }, //payload (username)
                process.env.REFRESH_TOKEN_SECRET, //secret key
                { expiresIn: '1d' } //token expiration time
            ); //pass in the payload (username) and secret key
    
            //Saving refreshToken with current user in the database (in the json file)
            foundUser.refreshToken = [... newRefreshTokenArray, newRefreshToken]; //add the refresh token to the user object
            const result = await foundUser.save(); //save the user object to the database
            
            //we send the refresh token to the client as a cookie (httpOnly) so it can't be accessed by javascript in the browser
            res.cookie('jwt', newRefreshToken, { //send the refresh token as a cookie
                httpOnly: true, //can't be accessed by javascript in the browser
                sameSite: 'None', //cross site cookie
                //secure: true,                                             //only send the cookie over https (in production)
                maxAge: 24 * 60 * 60 * 1000 //1 day in milliseconds
            }); //set the cookie with the refresh token and expiration time

            res.json({roles, accessToken});
        }
    );

}

module.exports = {handleRefreshToken}