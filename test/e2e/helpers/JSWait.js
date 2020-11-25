class JSWait extends codecept_helper { // eslint-disable-line camelcase
  async _beforeStep(step) {
    const helper = this.helpers.WebDriver || this.helpers.Puppeteer;

    let returnValue = '';
    // Wait for content to load before checking URL
    if (step.name === 'seeCurrentUrlEquals' || step.name === 'seeInCurrentUrl') {
      returnValue = await helper.waitForElement('body', 30);
    }
    returnValue = await Promise.resolve();
    // eslint-disable-next-line no-console
    console.log('returnValue is..', returnValue);
    return returnValue;
  }

  async navByClick(text, locator) {
    const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
    const helperIsPuppeteer = this.helpers.Puppeteer;

    helper.click(text, locator);

    if (helperIsPuppeteer) {
      await helper.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    } else {
      await helper.wait(2);
    }
  }

  async amOnLoadedPage(url, language = 'en') {
    const helper = this.helpers.WebDriver || this.helpers.Puppeteer;
    const helperIsPuppeteer = this.helpers.Puppeteer;
    let newUrl = `${url}?lng=${language}`;

    if (helperIsPuppeteer) {
      if (newUrl.indexOf('http') !== 0) {
        newUrl = helper.options.url + newUrl;
      }

      helper.page.goto(newUrl);
      await helper.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    } else {
      await helper.amOnPage(newUrl);
      await helper.waitForElement('body');
    }
  }
}

module.exports = JSWait;
