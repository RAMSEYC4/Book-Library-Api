const booksRouter = require("express").Router()
const BooKApi = require("../models/books.js")

//2 GET all books
booksRouter.get("/", (req, res, next) => {
  BooKApi.find({})
    .then((bookRecords) => {
      res.json(bookRecords)
    })
    .catch((error) => next(error))
})

//3 GET one book
booksRouter.get("/:id", (req, res, next) => {
  BooKApi.findById(req.params.id)
    .then((bookRecords) => {
      if (bookRecords) {
        return res.json(bookRecords)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
})

//4 POST add a book
booksRouter.post("/", (req, res, next) => {
  const body = req.body
  //Before adding check if data has content
  if (
    !body.title ||
    !body.author ||
    !body.year ||
    !body.genre ||
    body.read === undefined
  ) {
    return res.status(400).json({
      error: "Book information missing",
    })
  }
  const bookRecord = new BooKApi({
    title: body.title,
    author: body.author,
    year: body.year,
    genre: body.genre,
    read: body.read || false,
  })
  bookRecord
    .save()
    .then((newBookRecord) => {
      res.json(newBookRecord)
    })
    .catch((error) => next(error))
})

//5 PUT - replaces the entire book document with new data
booksRouter.put("/:id", (req, res, next) => {
  // pull all fields out of the request body
  const { title, author, year, genre, read } = req.body
  // PUT requires ALL fields — if any are missing, reject the request immediately
  // this is what makes PUT different from PATCH
  if (!title || !author || !year || !genre || !read) {
    return res.status(400).json({
      error:
        "All fields required for a full replacement: title, author, year, genre, read",
    })
  }
  // find the existing book in the database by its id
  BooKApi.findById(req.params.id)
    .then((bookRecord) => {
      if (!bookRecord) {
        return res.status(404).end()
      }
      // overwrite every field on the document with the new values from the request
      bookRecord.title = title
      bookRecord.author = author
      bookRecord.year = year
      bookRecord.genre = genre
      bookRecord.read = read
      // save the fully replaced document back to the database and return it
      return bookRecord.save().then((updatedBook) => {
        res.json(updatedBook)
      })
    })
    .catch((error) => next(error))
})

//6 PATCH - updates only the fields that were sent, leaves everything else untouched
booksRouter.patch("/:id", (req, res, next) => {
  // the request body only contains the fields the client wants to change
  const updates = req.body
  // find the existing book in the database by its id
  BooKApi.findById(req.params.id)
    .then((bookRecord) => {
      if (!bookRecord) {
        return res.status(404).end()
      }
      // Object.keys(updates) gives an array of only the fields that were sent
      // e.g. if body is { "title": "New Title" }, keys = ["title"]
      // forEach loops through each key and updates only that field on the document
      Object.keys(updates).forEach((key) => {
        bookRecord[key] = updates[key]
      })
      // save the partially updated document back to the database and return it
      return bookRecord.save().then((updatedBook) => {
        res.json(updatedBook)
      })
    })
    .catch((error) => next(error))
})

//7 DELETE a book
booksRouter.delete("/:id", (req, res, next) => {
  BooKApi.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = booksRouter
