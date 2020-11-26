const path = 'https://pcq.aat.platform.hmcts.net/start-page';

function seeEqualityPage(language = 'en') {
  const I = this;
  I.waitInUrl(path);
  I.seeInCurrentUrl(path);
  if (language === 'en') {
    I.waitForText('Equality and diversity questions', 5);
  }
}

function completePCQs(language = 'en') {
  if (language === 'en') {
    this.click('I don\'t want to answer these questions');
  } else {
    this.click('Dydw i ddim eisiau ateb y cwestiynau hyn');
  }
}

module.exports = {
  seeEqualityPage,
  completePCQs
};
