const User = require('../model/User'); //import the User model
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) =>{
    const {user, pwd} = req.body;
    if(!user || !pwd) return res.status(400).json({"message":"Username and Password are required"});

    //check for duplicate usernames in the db
    const duplicate = await User.findOne({username: user}).exec(); //findOne method returns a promise, so we need to use await to get the result
    if(duplicate) return res.sendStatus(409); //Conflict
    try{
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10); //also passing 10 slat rounds to make it more complex for anyone to find all pwd even if he know the pattern
        
        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        }); //create method returns a promise, so we need to use await to get the result

        //*************************************************************************
        //another way to create and store the new user
        // const newUser = new User();
        // newUser.username = user;
        // newUser.password = hashedPwd;
        // const result = await newUser.save(); //save method returns a promise, so we need to use await to get the result

        console.log(result); //log the result to the console
        
        res.status(201).json({"success": `New user ${user} created!`});
    }
    catch (err){
        res.status(500).json({"message": err.message}); //server error
    }
}

module.exports = {handleNewUser};