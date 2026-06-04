const express = require("express")
const mongoose = require("mongoose")
const logger = require("./utils/logger.js")
const config = require("./utils/config.js")
const booksRouter = require("./controllers/books.js")
const {
  unknownEndPoint,
  errorHandler,
  morgan,
} = require("./utils/middleware.js")

const app = express()

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms"),
)

logger.info("connecting to", config.MONGODB_URI)
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    console.log("connected to mongodb")
  })
  .catch((error) => {
    console.log("error connecting to mongodb", error.message)
  })

app.use(express.json())

app.use("/api/books", booksRouter)

app.use(unknownEndPoint)
app.use(errorHandler)

module.exports = app
