const SolicitorRep = require('steps/respondent/solicitor-representation/SolicitorRepresentation.step');
const content = require('steps/respondent/solicitor-representation/SolicitorRepresentation.content');

function seeSolicitorRepPage(language = 'en') {
  const I = this;
  I.waitInUrl(SolicitorRep.path, 15);
  I.seeCurrentUrlEquals(SolicitorRep.path);
  I.waitForText(content[language].title);
}

function selectYesHaveSolicitor(language = 'en') {
  this.click(content[language].fields.hasSolicitor.label);
}

function selectNoSolicitor(language = 'en') {
  this.click(content[language].fields.noSolicitor.label);
}

module.exports = {
  seeSolicitorRepPage,
  selectYesHaveSolicitor,
  selectNoSolicitor
};
