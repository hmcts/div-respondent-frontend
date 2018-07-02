const pa11y = require('pa11y');
const url = require('url');

module.exports = (testPage, method = 'GET') => {
  const host = url.parse(testPage).host;
  const indexUrl = `${host}index`;

  const pa11yRun = pa11y({
    hideElements: '.govuk-box-highlight, #logo, #footer, link[rel=mask-icon], .skipAccessTest',
    beforeScript(page, options, next) {
      if (method === 'POST') {
        page.open(testPage, 'POST', '', () => next());
      } else {
        page.open(testPage, () => next());
      }
    }
  });

  return new Promise((resolve, reject) => {
    pa11yRun.run(indexUrl, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};
