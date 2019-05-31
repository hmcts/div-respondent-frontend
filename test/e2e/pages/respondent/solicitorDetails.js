const SolicitorDetails = require('steps/respondent/solicitor-details/SolicitorDetails.step');
const content = require('steps/respondent/solicitor-details/SolicitorDetails.content');

function seeSolicitorDetailsPage() {
  const I = this;

  I.seeCurrentUrlEquals(SolicitorDetails.path);
  I.waitForText(content.en.title);
}

function fillInSolicitorForm() {
  const I = this;
  I.fillField('solicitorDetails.solicitorName', 'Solicitors Inc');
  I.fillField('solicitorDetails.firmName', 'John Lennon Associates');
  I.fillField('solicitorDetails.solicitorEmail', 'contact@solicitors.com');
  I.fillField('solicitorDetails.telephone', '01985673345');
  I.fillField('solicitorDetails.solicitorRefNumber', '1568ALT3212');
  I.click(content.en.fields.statementOfTruth.yes);
}

module.exports = {
  seeSolicitorDetailsPage,
  fillInSolicitorForm
};
