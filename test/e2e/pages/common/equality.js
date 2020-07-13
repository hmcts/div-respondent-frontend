const Equality = require('steps/equality/Equality.step');

function seeEqualityPage() {
  const I = this;
  I.waitInUrl(Equality.path, 15);
  I.seeCurrentUrlEquals(Equality.path);
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
