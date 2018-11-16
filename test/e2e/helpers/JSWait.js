class JSWait extends codecept_helper { // eslint-disable-line camelcase
  _beforeStep(step) {
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;

    // Wait for content to load before checking URL
    if (step.name === 'seeCurrentUrlEquals' || step.name === 'seeInCurrentUrl') {
      console.log('waiting for element'); // eslint-disable-line
      return helper.waitForElement('#content', 30);
    }
    return Promise.resolve();
  }

  async navByClick(text, locator) {
    const helper = this.helpers.WebDriverIO || this.helpers.Puppeteer;
    const helperIsPuppeteer = this.helpers.Puppeteer;

    helper.click(text, locator);

    if (helperIsPuppeteer) {
      await helper.page.waitForNavigation({ waitUntil: 'networkidle0' });
    } else {
      await helper.wait(2);
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
      console.log(`new url is ${newUrl}`); // eslint-disable-line
      await helper.page.waitForNavigation({ waitUntil: 'networkidle0' });
    } else {
      await helper.amOnPage(newUrl);
      await helper.waitInUrl(newUrl);
      await helper.waitForElement('#content');
    }
  }
}

module.exports = JSWait;
