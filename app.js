const express = require("express");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

require("./config/database");
require("./config/aws");
require("./config/auth.js");

const app = express();

const api = require("./routes/api");
const handleGlobalError = require("./middlewares/handleGlobalError");

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());

app.use("/api", api);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, `Can't find ${req.originalUrl} on this server`));
});

// error handler
app.use(handleGlobalError);

module.exports = app;
