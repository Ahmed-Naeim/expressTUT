const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
};

const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout =  async (req, res) =>{
    //On Client, also delete the access token
    //In the server, we will remove the refresh token from the database (json file) and also remove the cookie from the client
    
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.sendStatus(204); //successful but no content to send back

    const refreshToken = cookies.jwt;

    //Is refreshToken in db?
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly: true}); //secure: true only if using https
        return res.sendStatus(204); //successful but no content to send back
    }

    //Delete refreshToken in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken); //remove the user with the refresh token from the database
    const currentUser = {...foundUser, refreshToken: ''}; //remove the refresh token from the user
    usersDB.setUsers([...otherUsers, currentUser]); //update the usersDB with the new user
    await fsPromises.writeFile( //write the updated usersDB to the json file
        path.join(__dirname, '..', 'model', 'users.json'), //path to the json file
        JSON.stringify(usersDB.users) //write the updated usersDB to the json file
    );

    res.clearCookie('jwt', {httpOnly: true}); //secure: true only if using https
    res.sendStatus(204); //successful but no content to send back

}

module.exports = {handleLogout}