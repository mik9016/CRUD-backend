const mongoose = require('mongoose');

const schema = mongoose.Schema({
    imie: String,
    nazwisko: String
});

module.exports = mongoose.model('Note',schema);