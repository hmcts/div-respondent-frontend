const { EntryPoint } = require('@hmcts/one-per-page');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const idam = require('services/idam');
const config = require('config');
const { parseBool } = require('@hmcts/one-per-page/util');

class Entry extends EntryPoint {
  static get path() {
    return config.paths.index;
  }

  next() {
    const nextStep = parseBool(config.features.showSystemMessage) ? this.journey.steps.SystemMessage : this.journey.steps.Respond;
    return redirectTo(nextStep);
  }

  get middleware() {
    return [...super.middleware, idam.authenticate];
  }
}

module.exports = Entry;
