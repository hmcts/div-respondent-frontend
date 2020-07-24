const path = 'https://pcq.aat.platform.hmcts.net/start-page';

function seeEqualityPage() {
  const I = this;
  I.waitInUrl(path, 15);
  I.seeCurrentUrlEquals(path);
  I.waitForText('Equality and diversity questions', 5);
}

function completePCQs() {
  this.click('I don\'t want to answer these questions');
}

module.exports = {
  seeEqualityPage,
  completePCQs
};
