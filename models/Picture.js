const mongoose = require('mongoose');

const schema = mongoose.Schema({
    date: String,
    name : String,
    path: String
})

module.exports = mongoose.model('Picture', schema);