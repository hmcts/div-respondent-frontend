class JSWait extends codecept_helper { // eslint-disable-line camelcase
  _beforeStep(step) {
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;

    // Wait for content to load before checking URL
    if (step.name === 'seeCurrentUrlEquals') {
      helper.waitForElement('#content', 10);
    }
  }

  async navByClick(text, locator) {
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;
    const helperIsPuppeteer = this.helpers.Puppeteer;

    helper.click(text, locator);

    if (helperIsPuppeteer) {
      await helper.page.waitForNavigation({ waitUntil: 'networkidle0' });
    }
  }

  async amOnLoadedPage(url) {
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;
    const helperIsPuppeteer = this.helpers.Puppeteer;
    let newUrl = url;

    if (helperIsPuppeteer) {
      if (newUrl.indexOf('http') !== 0) {
        newUrl = helper.options.url + newUrl;
      }

      helper.page.goto(newUrl);
      await helper.page.waitForNavigation({ waitUntil: 'networkidle0' });
    } else {
      helper.amOnPage(newUrl);
    }
  }
}

module.exports = JSWait;
