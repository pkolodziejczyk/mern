const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    login: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    admin: {
        type: Boolean
    }
});

module.exports = mongoose.model('User', User);