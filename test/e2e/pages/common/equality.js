const path = 'https://pcq.aat.platform.hmcts.net/start-page';
const config = require('config');

function seeEqualityPage(language = 'en') {
  const I = this;
  I.waitInUrl(path);
  I.seeInCurrentUrl(path);
  if (language === 'en') {
    I.waitForText('Equality and diversity questions', 5);
  }
}

function completePCQs(language = 'en') {
  // PCQ pages only display in English on AAT (e.g. running nightly),
  // see bug: https://tools.hmcts.net/jira/browse/RPET-632
  if (language === 'en' || config.tests.e2e.addWaitForCrossBrowser) {
    this.click('I don\'t want to answer these questions');
  } else {
    this.click('Dydw i ddim eisiau ateb y cwestiynau hyn');
  }
}

module.exports = {
  seeEqualityPage,
  completePCQs
};
