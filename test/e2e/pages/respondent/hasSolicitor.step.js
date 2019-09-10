const SolicitorRep = require('steps/respondent/solicitor-representation/SolicitorRepresentation.step');
const content = require('steps/respondent/solicitor-representation/SolicitorRepresentation.content');

function seeSolicitorRepPage() {
  const I = this;
  I.waitInUrl(SolicitorRep.path, 15);
  I.seeCurrentUrlEquals(SolicitorRep.path);
  I.waitForText(content.en.title);
}

function selectYesHaveSolicitor() {
  this.click(content.en.fields.hasSolicitor.label);
}

function selectNoSolicitor() {
  this.click(content.en.fields.noSolicitor.label);
}

module.exports = {
  seeSolicitorRepPage,
  selectYesHaveSolicitor,
  selectNoSolicitor
};
