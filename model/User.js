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
    refreshToken: String
});

module.exports = mongoose.model('User', UserSchema); //export the User model to use it in other files