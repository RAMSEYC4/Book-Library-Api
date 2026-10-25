const express = require("express");
const mongoose = require("mongoose");
const logger = require("./utils/logger.js");
const config = require("./utils/config.js");
const booksRouter = require("./controllers/books.js");
const middleware = require("./utils/middleware.js");

const app = express();

logger.info("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info("connected to mongodb");
  })
  .catch((error) => {
    logger.error("error connecting to mongodb", error.message);
  });

app.use(express.json());
app.use(middleware.requestLogger);

app.use("/books", booksRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
