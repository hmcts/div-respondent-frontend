const { ExitPoint } = require('@hmcts/one-per-page');
const config = require('config');

class End extends ExitPoint {
  static get path() {
    return config.paths.end;
  }
}

module.exports = End;
