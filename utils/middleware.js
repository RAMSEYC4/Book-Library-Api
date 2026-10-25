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
const errorHandler = (error, req, res /*, next*/) => {
  console.error("Error", error.message);
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    //i can return the error.message here becuase it is user input
    return res.status(400).json({ error: error.message });
  } else {
    return res.status(500).json({ error: "internal server error" });
  }
  // next(error);
};

module.exports = { unknownEndPoint, errorHandler, requestLogger };
