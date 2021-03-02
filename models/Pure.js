const mongoose = require("mongoose");

const schema = mongoose.Schema({
  img: {
    data: Buffer,
    contentType: String,
  },
});

module.exports = mongoose.model("Pure", schema);
