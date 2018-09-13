const mockData = require('resources/raw-response-mock.json');
const { done } = require('@hmcts/one-per-page-test-suite');

const getMockedUserData = req => { // eslint-disable-line no-unused-vars
  return new Promise(((resolve, reject) => { // eslint-disable-line no-unused-vars
    resolve(mockData);
    done();
  }));
};

module.exports = getMockedUserData;