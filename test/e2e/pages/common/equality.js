// This will need to change once the PCQ-Divorce PR is merged into master
const path = 'https://pcq.aat.platform.hmcts.net/offline';

function seeEqualityPage() {
  const I = this;
  I.waitInUrl(path, 15);
  I.seeCurrentUrlEquals(path);
  I.waitForText('Equality and diversity questions', 5);
}

function completePCQs() {
  // This will need to change once the PCQ-Divorce PR is merged into master
  this.click('Continue');
}

module.exports = {
  seeEqualityPage,
  completePCQs
};
