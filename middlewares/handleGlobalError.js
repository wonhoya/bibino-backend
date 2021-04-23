/**
 * handle all the error in this handler
 * @param {error} error - error from previous middlewares
 * @param {incomingMessage} request - request from client
 * @param {serverresponse} response - response from server
 * @returns {undefined} does not have any return value
 */
const handleGlobalError = (err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.statusCode || 500);
  res.render("error");
};

module.exports = handleGlobalError;
