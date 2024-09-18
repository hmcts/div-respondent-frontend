'use strict';

const Helper = codecept_helper; // eslint-disable-line

class ElementExist extends Helper {
  checkElementExist(selector) {
    const helper = this.helpers.WebDriver || this.helpers.Puppeteer;

    return helper
      ._locate(selector)
      .then(els => {
        return Boolean(els.length);
      });
  }
}

module.exports = ElementExist;
