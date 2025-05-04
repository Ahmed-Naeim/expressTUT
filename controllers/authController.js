const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
};

const bcrypt = require('bcrypt');

    //Create JWTs
    const jwt = require('jsonwebtoken');
    const fsPromises = require('fs').promises;
    const path = require('path');

const handleLogin = async (req, res) =>{
    const {user, pwd} = req.body;

    if(!user || !pwd) return res.status(400).json({"message": "Username and Password are REQUIRED!!"});
    const foundUser = usersDB.users.find(person => person.username === user);
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

        const refreshToken = jwt.sign(
            { "username": foundUser.username }, //payload (username)
            process.env.REFRESH_TOKEN_SECRET, //secret key
            { expiresIn: '1d' } //token expiration time
        ); //pass in the payload (username) and secret key

        //Saving refreshToken with current user in the database (in the json file)
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser, refreshToken: refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]); //update the usersDB with the new user
        await fsPromises.writeFile( //
            path.join(__dirname, '..', 'model', 'users.json'), //path to the json file
            JSON.stringify(usersDB.users) //write the updated usersDB to the json file
        );

        //NOTE: we store access token in the client (local storage or session storage) and send it with every request to the server

        //we send the refresh token to the client as a cookie (httpOnly) so it can't be accessed by javascript in the browser
        res.cookie('jwt', refreshToken, { //send the refresh token as a cookie
            httpOnly: true, //can't be accessed by javascript in the browser
            sameSite: 'None', //cross site cookie
            secure: true, //only send the cookie over https (in production)
            maxAge: 24 * 60 * 60 * 1000 //1 day in milliseconds
        }); //set the cookie with the refresh token and expiration time
        res.json({ accessToken }); //send the access token to the client
    }
    else{
        res.sendStatus(401);
    }
}

module.exports = {handleLogin};