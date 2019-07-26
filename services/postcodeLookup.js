const config = require('config');
const request = require('request-promise-native');
const logger = require('services/logger').getLogger(__filename);

const formatAddress = address => {
  const addressAsArray = address.DPA.ADDRESS.split(', ');

  // if building has an number merge number and lane as part of first line
  if (address.DPA.BUILDING_NUMBER) {
    addressAsArray[1] = `${addressAsArray[0]} ${addressAsArray[1]}`;
    addressAsArray.shift();
  }

  return addressAsArray.join(', ');
};

const postcodeLookup = postcode => {
  const uri = `${config.services.postcode.baseUrl}/addresses/postcode?postcode=${encodeURIComponent(postcode)}&key=${config.services.postcode.token}`;

  const options = {
    uri,
    json: true
  };

  const formatAddresses = addresses => {
    return addresses.results.map(formatAddress);
  };

  return request.get(options)
    .then(formatAddresses)
    .catch(error => {
      logger.errorWithReq(null, 'get_postcode_error', 'Failed to retrieve postcode', error.message);
      throw error;
    });
};

module.exports = {
  postcodeLookup,
  formatAddress,
  // export request for testing due to setting defaults returns a new instance
  request
};
