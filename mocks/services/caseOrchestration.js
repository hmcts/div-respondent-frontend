const mockData = require('resources/raw-response-mock.json');


const getMockedUserData = (req, res, next) => {
  next(mockData);
};

module.exports = { getMockedUserData };