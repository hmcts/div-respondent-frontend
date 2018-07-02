const config = require('config');

let testEmail = '';
let testPassword = '';

const setTestEmail = email => {
  testEmail = email;
};

const setTestPassword = password => {
  testPassword = password;
};

const getTestEmail = () => {
  return config.idamTestEmail || testEmail;
};

const getTestPassword = () => {
  return config.idamTestPassword || testPassword;
};

module.exports = { setTestEmail, setTestPassword, getTestEmail, getTestPassword };
