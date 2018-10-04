const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');

class InvalidCaseState extends ExitPoint {
  static get path() {
    return config.paths.invalidCaseState;
  }
}

module.exports = InvalidCaseState;
