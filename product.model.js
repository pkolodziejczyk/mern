const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Product = new Schema({
    title: {
        type: String
    },
    price: {
        type: String
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Product', Product);