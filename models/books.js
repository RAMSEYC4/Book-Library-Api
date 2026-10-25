// defines the Mongoose schema for books
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 3,
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
  //many books can have 1 user
  user: {
    //where i store
    type: mongoose.Schema.Types.ObjectId,
    //where to find the real thing
    ref: "User",
  },
});

bookSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const books = mongoose.model("Book", bookSchema);
module.exports = books;
