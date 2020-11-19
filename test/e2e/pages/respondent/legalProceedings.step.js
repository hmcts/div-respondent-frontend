const LegalProceedingPage = require('steps/respondent/legal-proceedings/LegalProceedings.step');
const content = require('steps/respondent/legal-proceedings/LegalProceedings.content');

function seeLegalProceedingPage(language = 'en') {
  const I = this;

  I.waitInUrl(LegalProceedingPage.path, 15);
  I.seeCurrentUrlEquals(LegalProceedingPage.path);
  I.waitForText(content[language].title, 5);
}

function chooseNoLegalProceedings(language = 'en') {
  this.click(content[language].fields.no.heading);
}

module.exports = {
  seeLegalProceedingPage,
  chooseNoLegalProceedings
};
