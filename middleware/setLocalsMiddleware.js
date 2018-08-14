const idamLoggedin = (req, res, next) => {
  res.locals = res.locals || {};
  res.locals.isLoggedIn = req.hasOwnProperty('idam');
  next();
};

module.exports = { idamLoggedin };