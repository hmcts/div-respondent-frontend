const url = require('url');
class UrlHelper extends codecept_helper { // eslint-disable-line
  async getCurrentUrl() {
    const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
    const helperIsPuppeteer = this.helpers.Puppeteer;
    let fullUrl = '';

    if (helperIsPuppeteer) {
      fullUrl = await helper.page.url();
    } else {
      fullUrl = await helper.browser.getUrl();
    }
    return url.parse(fullUrl).pathname;
  }
}

module.exports = UrlHelper;
