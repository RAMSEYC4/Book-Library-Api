//morgan, unknownEndpoint, errorHandler
const logger = require("../utils/logger")
const morgan = require("morgan")

const requetLogger = (req, res, next) => {
  logger.infor("Method", req.method)
  logger.infor("Path", req.Path)
  logger.infor("Body", req.Body)
  logger.infor("-----------------")
  next()
}

const unknownEndPoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === "CastError") {
    return res.status(400).json({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = { unknownEndPoint, errorHandler, morgan, requetLogger }
