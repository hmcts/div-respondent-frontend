const LegalProceedingPage = require('steps/respondent/legal-proceedings/LegalProceedings.step');
const content = require('steps/respondent/legal-proceedings/LegalProceedings.content');

function seeLegalProceedingPage() {
  const I = this;

  I.waitInUrl(LegalProceedingPage.path, 15);
  I.seeCurrentUrlEquals(LegalProceedingPage.path);
  I.waitForText(content.en.title, 5);
}

function chooseNoLegalProceedings() {
  this.click(content.en.fields.no.heading);
}

module.exports = {
  seeLegalProceedingPage,
  chooseNoLegalProceedings
};
