const booksRouter = require("express").Router();
const BooKApi = require("../models/books.js");

//1 GET all books
booksRouter.get("/", async (req, res, next) => {
  try {
    const books = await BooKApi.find({});
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
});

//2 GET one book
booksRouter.get("/:id", async (req, res, next) => {
  try {
    const book = await BooKApi.findById(req.params.id);
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
    const savedBook = await BooKApi.create({
      title: body.title,
      author: body.author,
      year: body.year,
      genre: body.genre,
      read: body.read,
    });
    res.status(201).json(savedBook);
  } catch (error) {
    next(error);
  }
});

//4 PUT replace the whole resource
booksRouter.put("/:id", async (req, res, next) => {
  try {
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
    const bookRecord = await BooKApi.findByIdAndUpdate(
      req.params.id,
      { title, author, year, genre, read },
      { new: true, runValidators: true },
    );
    if (!bookRecord) {
      return res.status(404).json({ error: "book not found" });
    }
    // save the fully replaced document back to the database and return it
    res.status(200).json(bookRecord);
  } catch (error) {
    next(error);
  }
});

//5 PATCH - updates only the fields that were sent, leaves everything else untouched
booksRouter.patch("/:id", async (req, res, next) => {
  try {
    // the request body only contains the fields the client wants to change
    const body = req.body;
    const fieldsAllowed = ["title", "author", "year", "genre", "read"];
    const updateBooks = {};
    fieldsAllowed.forEach((field) => {
      if (field in body) {
        updateBooks[field] = body[field];
      }
    });
    const bookUpdate = await BooKApi.findByIdAndUpdate(
      req.params.id,
      updateBooks,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!bookUpdate) {
      return res.status(404).json({ error: "book not found" });
    }
    res.status(200).json(bookUpdate);
  } catch (error) {
    next(error);
  }
});

//6 DELETE a book
booksRouter.delete("/:id", async (req, res, next) => {
  try {
    const book = await BooKApi.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "book not found" });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = booksRouter;
