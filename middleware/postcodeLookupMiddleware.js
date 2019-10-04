const postcodeLookup = require('services/postcodeLookup');

const getAddressFromPostcode = (req, res, next) => {
  const isPost = req.method === 'POST';
  const hasPostcode = req.body && req.body.postcode && req.body.postcode.length;

  if (isPost && hasPostcode) {
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