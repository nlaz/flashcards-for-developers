const mongoose = require("mongoose");
const config = require("../config/index");

module.exports = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.database.uri, {
    useNewUrlParser: true,
  });

  const database = mongoose.connection;

  database.on("error", console.error.bind(console, "MongoDB connection error"));

  return database;
};
