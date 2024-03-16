require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");

const { v4: uuidv4 } = require("uuid");
const myLogger = require("./loggers/mylogger.log");
// * Init App
const app = express();

// * Init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  const requestId = req.header["x-request-id"];
  req.requestId = requestId || uuidv4();
  myLogger.log(`input params :: ${req.method} ::`, [
    req.path,
    {
      requestId: req.requestId,
    },
    req.method === "POST" ? req.body : req.query,
  ]);
  next();
});

// * Test Redis Pub/sub
// require("./tests/inventory.test")
// const productTest = require("./tests/product.test")
// productTest.purchaseProduct("product:001", 10)

// * Init databases
require("./dbs/init.mongodb");

// * Check Overload Access Mongodb
const { checkOverload } = require("./helpers/check.connect");
checkOverload();

// * Init routes
app.use("/", require("./routes"));

// * Handle errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;

  const resMessage = `${statusCode} - ${Date.now() - error.now}ms - Response: ${JSON.stringify(error)}`

  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: error.message },
  ]);

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
