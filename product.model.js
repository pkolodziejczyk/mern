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
    },
    //Solution 1
    //category:{
    //    type: [String]
    //},
    //Solution 2
    categories: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
});

module.exports = mongoose.model('Product', Product);