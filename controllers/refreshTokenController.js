const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) {this.users = data}
};

//Create JWTs
const jwt = require('jsonwebtoken');


const handleRefreshToken =  (req, res) =>{
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.sendStatus(401); //check if has a cookie then check if there is a jwt property
    const refreshToken = cookies.jwt;

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    if(!foundUser) return res.sendStatus(403); //forbidden

    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) =>{
            if(err || foundUser.username !== decoded.username) return res.sendStatus(403);
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
            res.json({accessToken});
        }
    )

}

module.exports = {handleRefreshToken}