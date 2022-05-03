const { EntryPoint } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const { getWebchatOpeningHours } = require('../../middleware/getWebchatOpenHours');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.index;
  }

  next() {
    return redirectTo(this.journey.steps.Respond);
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours,
      idam.authenticate
    ];
  }
}

module.exports = Entry;
