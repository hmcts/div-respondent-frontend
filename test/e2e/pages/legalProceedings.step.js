const LegalProceedingPage = require('steps/legal-proceedings/LegalProceedings.step');
const content = require('steps/legal-proceedings/LegalProceedings.content');

function seeLegalProceedingPage() {
  const I = this;

  I.seeCurrentUrlEquals(LegalProceedingPage.path);
  I.waitForText(content.en.title);
}

function chooseNoLegalProceedings() {
  this.click(content.en.fields.no.heading);
}

module.exports = {
  seeLegalProceedingPage,
  chooseNoLegalProceedings
};
