const mockData = require('resources/mock');

const getUserData = (req, res, next) => {
  Object.assign(req.session, mockData);
  next();
};

module.exports = { getUserData };