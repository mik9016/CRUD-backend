const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/routes");
const mongoose = require("mongoose");
require("dotenv").config();




mongoose.Promise = global.Promise;

const app = express();
const URI = process.env.URI;

app.use(cors());
app.use(bodyParser.json());


// console.log(URI);
mongoose
  .connect(URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(console.log("connected to MongoDB"))
  .then(() => {
    app.use(routes);
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`APP is listening to port: ${PORT}`);
});
