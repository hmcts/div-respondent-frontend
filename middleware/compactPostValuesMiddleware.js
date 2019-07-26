const { compact } = require('lodash');

const compactPostValuesMiddleware = (req, res, next) => {
  if (req.method === 'POST') {
    Object.keys(req.body).forEach(key => {
      if (Array.isArray(req.body[key])) {
        req.body[key] = compact(req.body[key]);
      }
    });
  }

  next();
};

module.exports = compactPostValuesMiddleware;