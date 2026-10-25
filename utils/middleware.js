//morgan, unknownEndpoint, errorHandler
const logger = require("../utils/logger");

const requestLogger = (req, res, next) => {
  if (req.method === "GET" || req.method === "DELETE") {
    logger.info("-----------------");
    logger.info("Method", req.method);
    logger.info("Path", req.path);
    logger.info("-----------------");
  } else {
    logger.info("-----------------");
    logger.info("Method", req.method);
    logger.info("Path", req.path);
    logger.info("Body", req.body);
    logger.info("-----------------");
  }
  next();
};

const unknownEndPoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

//Main error handler for routes
const errorHandler = (error, req, res, next) => {
  console.error("Error", error.message);
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    //i can return the error.message here becuase it is user input
    return res.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({ error: "expected `username` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  } else {
    return res.status(500).json({ error: "internal server error" });
  }
};

module.exports = { unknownEndPoint, errorHandler, requestLogger };
