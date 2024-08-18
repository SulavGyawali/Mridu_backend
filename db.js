const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/mridu";

const connectToMongo = () => {
  mongoose.connect(mongoURI);
  console.log("Connected to mongobd");
};

module.exports = connectToMongo;
