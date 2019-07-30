const config = require('config');
const request = require('request-promise-native');
const logger = require('services/logger').getLogger(__filename);
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

const cleanLine = function(line) {
  return line.replace(' null', ' ').replace('null ', ' ')
    .replace(/undefined/g, '')
    .replace(/ +/g, ' ')
    .trim()
    .replace(/^,/g, '');
};

const buildConcatenatedAddress = function(address) { // eslint-disable-line complexity
  let firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.PO_BOX_NUMBER} ${address.DPA.SUB_BUILDING_NAME}  ${address.DPA.BUILDING_NUMBER}, ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.BUILDING_NAME}`;
  let secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY}  ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;

  if (`${address.DPA.BUILDING_NAME}` !== 'undefined') {
    firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NUMBER}, ${address.DPA.BUILDING_NAME} `;
    secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;
  }

  if (`${address.DPA.BUILDING_NAME}` !== 'undefined' && `${address.DPA.THOROUGHFARE_NAME}` !== 'undefined' && `${address.DPA.BUILDING_NUMBER}` === 'undefined') {
    firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NAME} `;
    secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;
  }

  if (`${address.DPA.PO_BOX_NUMBER}` !== 'undefined') {
    firstLine = ` ${address.DPA.CLASSIFICATION_CODE_DESCRIPTION} ${address.DPA.PO_BOX_NUMBER}, ${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME}   ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NUMBER} ${address.DPA.BUILDING_NAME} `;
    secondLine = `${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} `;
  }

  if (`${address.DPA.BUILDING_NUMBER}` !== 'undefined' && `${address.DPA.SUB_BUILDING_NAME}` !== 'undefined' && `${address.DPA.THOROUGHFARE_NAME}` !== 'undefined') {
    if (`${address.DPA.BUILDING_NAME}` === 'undefined') {
      firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME}`;
      secondLine = `${address.DPA.BUILDING_NUMBER}, ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.DEPENDENT_LOCALITY} `;
    } else {
      firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME} ${address.DPA.SUB_BUILDING_NAME}, ${address.DPA.BUILDING_NAME} `;
      secondLine = `${address.DPA.BUILDING_NUMBER}, ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY} ${address.DPA.DEPENDENT_LOCALITY} `;
    }
  }

  if (`${address.DPA.ORGANISATION_NAME}` !== 'undefined' && `${address.DPA.THOROUGHFARE_NAME}` !== 'undefined') {
    firstLine = `${address.DPA.ORGANISATION_NAME} ${address.DPA.DEPARTMENT_NAME}`;
    secondLine = `${address.DPA.BUILDING_NUMBER} ${address.DPA.SUB_BUILDING_NAME} ${address.DPA.BUILDING_NAME}, ${address.DPA.THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_THOROUGHFARE_NAME} ${address.DPA.DEPENDENT_LOCALITY} ${address.DPA.DOUBLE_DEPENDENT_LOCALITY}`;
  }


  let concatenatedAddress = [];

  if (cleanLine(secondLine) === '') {
    concatenatedAddress = [
      cleanLine(firstLine),
      address.DPA.POST_TOWN,
      address.DPA.POSTCODE

    ];
  } else {
    concatenatedAddress = [
      cleanLine(firstLine),
      cleanLine(secondLine),
      address.DPA.POST_TOWN,
      address.DPA.POSTCODE

    ];
  }

  return concatenatedAddress;
};

const formatAddress = address => {
  const addressAsArray = buildConcatenatedAddress(address);
  const addressAsString = addressAsArray.join('\r\n');
  // ensure any html entities are encoded i.e. & becomes &amp;
  const addressEncoded = entities.encode(addressAsString);

  return addressEncoded;
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
