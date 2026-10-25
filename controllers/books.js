const booksRouter = require("express").Router();
const BooKApi = require("../models/books.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const getTokenFrom = require("../utils/auth_helper.js");

//1 GET all books
booksRouter.get("/", async (req, res, next) => {
  try {
    const books = await BooKApi.find({}).populate("user", {
      username: 1,
      name: 1,
    });
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

//2 GET one book
booksRouter.get("/:id", async (req, res, next) => {
  try {
    const book = await BooKApi.findById(req.params.id).populate("user", {
      username: 1,
      name: 1,
    });
    if (!book) {
      return res.status(404).json({ error: "book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    next(error);
  }
});

//3 POST add a book
booksRouter.post("/", async (req, res, next) => {
  try {
    const body = req.body;
    const decodeToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodeToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }
    const user = await User.findById(decodeToken.id);
    if (!user) {
      return res.status(404).json({ error: "userId missing or not valid" });
    }
    const savedBook = await BooKApi.create({
      title: body.title,
      author: body.author,
      year: body.year,
      genre: body.genre,
      read: body.read,
      user: user._id,
    });
    // after savedBook is created:
    user.books = user.books.concat(savedBook._id);
    await user.save();
    res.status(201).json(savedBook);
  } catch (error) {
    next(error);
  }
});

//this does not work
//4 PUT replace the whole resource
booksRouter.put("/:id", async (req, res, next) => {
  try {
    const decodeToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodeToken.id) {
      return res.status(401).json({ error: "token invalid" });
    }
    const user = await User.findById(decodeToken.id);
    if (!user) {
      return res.status(401).json({ error: "user not found " });
    }
    const book = await BooKApi.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "book not found" });
    }
    if (book.user.toString() !== decodeToken.id) {
      return res.status(403).json({ error: "you are not the owner" });
    }
    // pull all fields out of the request body
    const { title, author, year, genre, read } = req.body;
    // PUT requires ALL fields — if any are missing, reject the request immediately
    // this is what makes PUT different from PATCH
    if (!title || !author || !year || !genre || read === undefined) {
      return res.status(400).json({
        error:
          "All fields are required for a full replacement: title, author, year, genre, read",
      });
    }
    book.title = title;
    book.author = author;
    book.year = year;
    book.genre = genre;
    book.read = read;
    const updateBook = await book.save();
    // save the fully replaced document back to the database and return it
    res.status(200).json(updateBook);
  } catch (error) {
    next(error);
  }
});

//5 PATCH - updates only the fields that were sent, leaves everything else untouched
booksRouter.patch("/:id", async (req, res, next) => {
  try {
    const body = req.body;
    const decodeToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodeToken) {
      return res.status(401).json({ error: "token invalid" });
    }
    const user = await User.findById(decodeToken.id);
    if (!user) {
      return res.status(401).json({ error: "userId missing or not valid" });
    }
    const book = await BooKApi.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "book not found" });
    }
    if (book.user.toString() !== decodeToken.id) {
      return res.status(403).json({ error: "you are not the owner" });
    }
    // the request body only contains the fields the client wants to change
    const fieldsAllowed = ["title", "author", "year", "genre", "read"];
    // const updateBooks = {};
    fieldsAllowed.forEach((field) => {
      if (field in body) {
        book[field] = body[field];
      }
    });
    const updateBooks = await book.save();
    res.status(200).json(updateBooks);
  } catch (error) {
    next(error);
  }
});

//6 DELETE a book
booksRouter.delete("/:id", async (req, res, next) => {
  try {
    const decodeToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
    if (!decodeToken) {
      return res.status(401).json({ error: "token invalid" });
    }
    const user = await User.findById(decodeToken.id);
    if (!user) {
      return res.status(401).json({ error: "userId missing or not valid" });
    }
    const book = await BooKApi.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.user.toString() !== decodeToken.id) {
      return res.status(403).json({ error: "you are not the owner" });
    }
    await book.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = booksRouter;
