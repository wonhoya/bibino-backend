const mongoose = require("mongoose");
const { databaseURI, databasePassword } = require("./index");

mongoose.connect(databaseURI.replace("<password>", databasePassword), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
