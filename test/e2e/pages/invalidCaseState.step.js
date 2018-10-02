const InvalidCaseState = require('steps/invalid-case-state/InvalidCaseState.step');
const content = require('steps/invalid-case-state/InvalidCaseState.content');

function seeInvalidStatePage() {
  const I = this;

  I.seeCurrentUrlEquals(InvalidCaseState.path);
  I.see(content.en.title);
}

module.exports = {
  seeInvalidStatePage
};
