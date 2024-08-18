const mongoose = require("mongoose");
const Schema = require("mongoose");

const BookSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    path: String,
    name: String,
    contentType: String,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Books = mongoose.model("book", BookSchema);

module.exports = Books
