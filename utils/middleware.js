//morgan, unknownEndpoint, errorHandler
const logger = require("../utils/logger")

const requestLogger = (req, res, next) => {
  logger.info("Method", req.method)
  logger.info("Path", req.path)
  logger.info("Body", req.body)
  logger.info("-----------------")
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

module.exports = { unknownEndPoint, errorHandler, requestLogger }
