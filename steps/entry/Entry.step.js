const { EntryPoint } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.entry;
  }

  next() {
    return redirectTo(this.journey.steps.Protected);
  }

  get middleware() {
    return [...super.middleware, idam.authenticate()];
  }
}

module.exports = Entry;
