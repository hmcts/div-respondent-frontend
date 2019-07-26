const postcodeLookup = require('services/postcodeLookup');

const getAddressFromPostcode = (req, res, next) => {
  if (req.body.postcode && req.body.postcode.length) {
    return postcodeLookup.postcodeLookup(req.body.postcode)
      .then(response => {
        req.body = Object.assign(req.body, { postcodeList: response });
        next();
      })
      .catch(() => {
        req.body = Object.assign(req.body, { postcodeList: [] });
        next();
      });
  }
  return next();
};

module.exports = { getAddressFromPostcode };