const { Page } = require('@hmcts/one-per-page');
const { getWebchatOpeningHours } = require('middleware/getWebchatOpenHours');

class AvayaWebchat extends Page {
  static get path() {
    return '/avaya-webchat';
  }

  get middleware() {
    return [
      ...super.middleware,
      getWebchatOpeningHours
    ];
  }
}

module.exports = AvayaWebchat;
