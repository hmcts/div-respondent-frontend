const idamLoggedin = (req, res, next) => {
  res.locals = res.locals || {};
  res.locals.isLoggedIn = req.idam ? true : false; // eslint-disable-line
  next();
};

module.exports = { idamLoggedin };