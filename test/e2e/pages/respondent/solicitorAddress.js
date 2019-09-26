const SolicitorAddress = require('steps/respondent/solicitor-address/SolicitorAddress.step');
const content = require('steps/respondent/solicitor-address/SolicitorAddress.content');

function seeSolicitorAddressPage() {
  const I = this;

  I.seeCurrentUrlEquals(SolicitorAddress.path);
  I.waitForText(content.en.title);
}

function seeConfirmSolicitorAddress() {
  const I = this;

  I.seeCurrentUrlEquals(`${SolicitorAddress.path}/confirm-address`);
  I.waitForText(content.en.confirmAddressTitle);
}

function confirmSolicitorAddress() {
  const I = this;

  I.seeCurrentUrlEquals(`${SolicitorAddress.path}/confirm-address`);
  this.click(content.en.fields.confirmAddress.yes);
}

function fillManuallSolicitorAddressForm() {
  const I = this;
  I.seeCurrentUrlEquals(SolicitorAddress.path);
  I.navByClick(content.en.noUkPostcode);
  I.seeCurrentUrlEquals(`${SolicitorAddress.path}/manual-address`);
  I.fillField('manualAddress', 'some address entered manually');
}

function fillPostcodeSolicitorAddressForm() {
  const I = this;

  I.seeCurrentUrlEquals(SolicitorAddress.path);

  I.fillField('postcode', 'SW9 9PE');
  I.click('Find address');

  I.seeCurrentUrlEquals(SolicitorAddress.path);
  I.waitForVisible('#selectedAddress');
  I.selectOption('#selectedAddress', '2, WILBERFORCE ROAD, LONDON, N4 2SW');

  I.waitForVisible('#address-0');
}

module.exports = {
  seeSolicitorAddressPage,
  fillPostcodeSolicitorAddressForm,
  seeConfirmSolicitorAddress,
  fillManuallSolicitorAddressForm,
  confirmSolicitorAddress
};
