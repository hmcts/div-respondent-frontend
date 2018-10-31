const config = require('config');

let testEmail = '';
let testPassword = '';
let testToken = '';

const setTestEmail = email => {
  testEmail = email;
};

const setTestPassword = password => {
  testPassword = password;
};

const setTestToken = token => {
  testToken = token;
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

module.exports = {
  setTestEmail,
  setTestPassword,
  setTestToken,
  getTestEmail,
  getTestPassword,
  getTestToken
};
