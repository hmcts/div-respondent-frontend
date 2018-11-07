const config = require('config');

let testEmail = '';
let testPassword = '';
let testToken = '';
let testPin = '';

const setTestEmail = email => {
  testEmail = email;
};

const setTestPassword = password => {
  testPassword = password;
};

const setTestToken = token => {
  testToken = token;
};

const setPin = pin => {
  testPin = pin;
};

const getTestEmail = () => {
  return config.idamTestEmail || testEmail;
};

const getTestPassword = () => {
  return config.idamTestPassword || testPassword;
};

const getTestToken = () => {
  return testToken;
};

const getPin = () => {
  return testPin;
};

module.exports = {
  setTestEmail,
  setTestPassword,
  setTestToken,
  setPin,
  getTestEmail,
  getTestPassword,
  getTestToken,
  getPin
};
