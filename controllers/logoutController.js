const User = require('../model/User'); //import the User model

const handleLogout =  async (req, res) =>{
    //On Client, also delete the access token
    //In the server, we will remove the refresh token from the database (json file) and also remove the cookie from the client
    
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.sendStatus(204); //successful but no content to send back

    const refreshToken = cookies.jwt;

    //Is refreshToken in db?
    const foundUser = await User.findOne({refreshToken}).exec(); //findOne method returns a promise, so we need to use await to get the result
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'None' , secure: 'true'}); //secure: true only if using https
        return res.sendStatus(204); //successful but no content to send back
    }

    //Delete refreshToken in db
    foundUser.refreshToken = ''; //remove the refresh token from the user object
    const result = await foundUser.save(); //save the user object to the database
    console.log(result); //log the result to the console

    res.clearCookie('jwt', {httpOnly: true, sameSite:'None', secure: true}); //secure: true only if using https
    res.sendStatus(204); //successful but no content to send back

}

module.exports = {handleLogout}