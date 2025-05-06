const { parseISOWithOptions } = require('date-fns/fp');
const mongoose = require('mongoose');
const Schema = mongoose.Schema; //import the Schema class from mongoose

const UserSchema = new mongoose.Schema({
    //ObjectId is automatically created by mongoose
    username: {
        type: String,
        required: true,
    },
    roles: {
        User: {
            type: Number,
            default: 2001,
        },
        Editor: Number,
        Admin: Number,
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: [String] //to apply fresh token rotation make it an array of strings not a string
});

module.exports = mongoose.model('User', UserSchema); //export the User model to use it in other files