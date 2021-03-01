const mongoose = require('mongoose');

const schema = mongoose.Schema({

    path : String
})

module.exports = mongoose.model('Picture', schema);