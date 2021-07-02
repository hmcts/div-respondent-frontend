const { Page } = require('@hmcts/one-per-page');

class AvayaWebchat extends Page {
  static get path() {
    return '/avaya-webchat';
  }
}

module.exports = AvayaWebchat;
