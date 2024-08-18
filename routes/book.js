const express = require("express");
const router = express.Router();
const multer = require("multer");
const Books = require("../models/Book");
const { v4: uuidv4 } = require("uuid");

const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${uuidv4()}.${file.originalname.split(".").at(-1)}`
    );
  },
});

const upload = multer({
  storage: Storage,
}).single("book");

router.post("/addbook", (req, res) => {
  upload(req, res, async () => {
    const { name, description, price } = req.body;
    try {
      const newBook = new Books({
        name: name,
        image: {
          path: req.file.filename,
          name: req.file.originalname,
          contentType: "image/png",
        },
        description: description,
        price: price,
      });
      const savedBook = await newBook.save();
      res.json(newBook);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  });
});

router.get("/fetchallbooks", async (req, res) => {
  try {
    const books = await Books.find();
    res.json(books);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Internal Server Error");
  }
});

router.put("/updatebook/:id", (req, res) => {
  upload(req, res, async () => {
    const { name, description, price } = req.body;
    const newBook = {};
    try {
      if(req.file){
        newBook.image = {
          path: req.file.filename,
          name: req.file.originalname,
          contentType: "image/png",
        }
      }
      if (name) {
        newBook.name = name;
      }
      if (description) {
        newBook.description = description;
      }
      if (price) {
        newBook.price = price;
      }

      //Find the note to be updated
      let book = await Books.findById(req.params.id);
      if (!book) {
        return res.status(404).send("Not Found.");
      }
      book = await Books.findByIdAndUpdate(
        req.params.id,
        { $set: newBook },
        { new: true }
      );
      res.json({ book });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
});

router.delete("/deletebook/:id", async (req, res) => {
  try {
    //Find the note to be deleted
    let book = await Books.findById(req.params.id);
    if (!book) {
      return res.status(404).send("Not Found.");
    }
    book = await Books.findByIdAndDelete(
      req.params.id
    ); 
    res.json({Success: "Book has been deleted", book: book });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
