const express = require("express");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");

const app = express();
require("./config/database");

const api = require("./routes/api");
// const index = require("./routes/index");
// const beers = require("./routes/beers");
const handleGlobalError = require("./middlewares/handleGlobalError");

if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());

//이부분은 나중에 token 판별하는 로직 꽂아넣으면 좋을듯 for auth
//app.all("*", verifyToken);
app.use("/api", api);
// app.use("/beers", beers);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404, `Can't find ${req.originalUrl} on this server`));
});

// error handler
app.use(handleGlobalError);

module.exports = app;
