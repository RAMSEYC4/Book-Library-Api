// defines the Mongoose schema for books
const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 5,
    required: true,
  },
  author: {
    type: String,
    minLength: 5,
    required: true,
  },
  year: {
    type: String,
    minLength: 4,
    required: true,
  },
  genre: {
    type: String,
    minLength: 5,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
})

bookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("BooKApi", bookSchema)
