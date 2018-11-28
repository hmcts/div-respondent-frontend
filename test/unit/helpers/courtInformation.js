const fs = require('fs');
const { expect } = require('@hmcts/one-per-page-test-suite');

module.exports = {
  buildSessionWithCourtsInfo(chosenDivorceCenter) {
    // Simulate what the petitionMiddleware does
    /* eslint-disable */
    const courtsList = JSON.parse(fs.readFileSync('test/unit/resources/courtsList.json'));
    const req = {
      session: {}
    };
    req.session.serviceCentreName = courtsList[chosenDivorceCenter].serviceCentreName;
    req.session.divorceCenterName = courtsList[chosenDivorceCenter].divorceCentre;
    req.session.divorceCenterCourtCity = courtsList[chosenDivorceCenter].courtCity;
    req.session.divorceCenterPostCode = courtsList[chosenDivorceCenter].postCode;
    if (courtsList[chosenDivorceCenter].poBox) {
      req.session.divorceCenterPoBox = courtsList[chosenDivorceCenter].poBox;
    }
    if (courtsList[chosenDivorceCenter].street) {
      req.session.divorceCenterStreet = courtsList[chosenDivorceCenter].street;
    }
    return req.session;
  },
  testDivorceUnitDetailsRender(html) {
    expect(html).to.include('West Midlands Regional Divorce Centre')
      .and.to.include('PO Box 3650')
      .and.to.include('Stoke-on-Trent')
      .and.to.include('ST4 9NH');
    expect(html).to.not.include('Courts and Tribunals Service Centre');
  },
  testCTSCDetailsRender(html) {
    expect(html).to.not.include('Your divorce centre');
    expect(html).to.include('Courts and Tribunals Service Centre')
      .and.to.include('c/o East Midlands Regional Divorce Centre')
      .and.to.include('PO Box 10447')
      .and.to.include('Nottingham')
      .and.to.include('NG2 9QN');
  }
};