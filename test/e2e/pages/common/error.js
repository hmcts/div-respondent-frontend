const errorContent = require('views/errors/error-content');

function seeServerErrorContent() {
  const I = this;

  I.see(errorContent.serviceName);
  I.see(errorContent.tryAgain);
  I.see(errorContent.canContact);
  I.see(errorContent.isThereAProblemWithThisPagePhone);
  I.see(errorContent.isThereAProblemWithThisPageEmail);
}

function seeNotFoundErrorContent() {
  const I = this;

  I.see(errorContent.notFoundMessage);
  I.see(errorContent.isThereAProblemWithThisPageParagraph);
  I.see(errorContent.isThereAProblemWithThisPagePhone);
  I.see(errorContent.isThereAProblemWithThisPageEmail);
}

module.exports = {
  seeServerErrorContent,
  seeNotFoundErrorContent
};
