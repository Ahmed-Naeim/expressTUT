const User = require('../models/User');

const getAllUsers = async (req, res) => {
    //search for users in the database and if not found, return a 204 status code with a message
    const users = await User.find(); //find() method returns a promise, so we need to use await to get the result
    if (!users) return res.status(204).json({ 'message': 'No users found.' });
    res.json(users); //send the users to the client
}

const createNewUser = async (req, res) => {
    if(!req?.body.firstname || !req?.body.lastname) {
        return res.status(400).json({ 'message': 'User data required.' });
    }
    try{
        const result = await User.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });
        res.status(201).json(result); //send the user to the client
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ 'message': 'Internal server error.' });
    }
}

const updateUser = async (req, res) => {
    if(!req?.body.id) {
        return res.status(400).json({ 'message': ' ID is required.' });
    }
    const user = await User.findOne({_id: req.body.id}).exec(); //findOne method returns a promise, so we need to use await to get the result
    if (!user) {
        return res.status(204).json({ "message": `No User Matches ID ${req.body.id}` });
    }
    if(req.body?.firstname) user.firstname = req.body.firstname;
    if(req.body?.lastname) user.lastname = req.body.lastname;

    const result = await user.save(); //save the user object to the database
    res.json(result); //send the user to the client
}

const deleteUser = async (req, res) => {
    if(!req?.body?.id) return res.status(400).json({ 'message': 'User ID required.' });

    const user = await User.findOne({_id: req.body.id }).exec(); //findOne method returns a promise, so we need to use await to get the result
    if (!user) {
        return res.status(204).json({ "message": `No User Matches ID ${req.body.id}` });
    }
    const result = await user.deleteOne({ _id: req.body.id }); //deleteOne method returns a promise, so we need to use await to get the result
    res.json(result); //send the user to the client
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required.' });
    const user = await User.findOne({ _id: req.params.id }).exec(); //findOne method returns a promise, so we need to use await to get the result
    if (!user) {
        return res.status(204).json({ "message": `No User Matches ID ${req.body.id}` });
    }
    res.json(user); //send the user to the client
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
};