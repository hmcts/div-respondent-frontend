const AdmitAdulteryPage = require('steps/co-respondent/cr-admit-adultery/CrAdmitAdultery.step');
const content = require('steps/co-respondent/cr-admit-adultery/CrAdmitAdultery.content');

function seeCrAdmitAdulteryPage(language = 'en') {
  const I = this;
  I.seeCurrentUrlEquals(AdmitAdulteryPage.path);
  I.waitForText(content[language].title);
}

function clickCrToAdmitAdultery(language = 'en') {
  this.click(content[language].fields.admit.label);
}

function clickCrToNotAdmitAdultery() {
  this.click(content.en.fields.doNotAdmit.label);
}

module.exports = {
  seeCrAdmitAdulteryPage,
  clickCrToAdmitAdultery,
  clickCrToNotAdmitAdultery
};
