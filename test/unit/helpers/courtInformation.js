const { expect } = require('@hmcts/one-per-page-test-suite');
const courtsList = require('test/unit/resources/courtsList');

module.exports = {
  buildSessionWithCourtsInfo(chosenDivorceCenter) {
    // Simulate what the petitionMiddleware does
    const req = {
      session: {
        originalPetition: { }
      }
    };
    req.session.serviceCentreName = courtsList[chosenDivorceCenter].serviceCentreName;
    req.session.divorceCenterName = courtsList[chosenDivorceCenter].divorceCentre;
    req.session.divorceCenterCourtCity = courtsList[chosenDivorceCenter].courtCity;
    req.session.divorceCenterPostCode = courtsList[chosenDivorceCenter].postCode;
    req.session.divorceCenterEmail = courtsList[chosenDivorceCenter].email;

    if (courtsList[chosenDivorceCenter].poBox) {
      req.session.divorceCenterPoBox = courtsList[chosenDivorceCenter].poBox;
    }
    if (courtsList[chosenDivorceCenter].street) {
      req.session.divorceCenterStreet = courtsList[chosenDivorceCenter].street;
    }
    return req.session;
  },
  testDivorceUnitDetailsRender(html, verifyContactDetails = true) {
    expect(html).to.include('West Midlands Regional Divorce Centre')
      .and.to.include('PO Box 3650')
      .and.to.include('Stoke-on-Trent')
      .and.to.include('ST4 9NH');

    if (verifyContactDetails) {
      expect(html).to.include('westmidlandsdivorce@hmcts.gsi.gov.uk');
    }

    expect(html).to.not.include('Courts and Tribunals Service Centre');
  },
  testCTSCDetailsRender(html, verifyContactDetails = true) {
    expect(html).to.not.include('Your divorce centre');
    expect(html).to.include('Courts and Tribunals Service Centre')
      .and.to.include('c/o East Midlands Regional Divorce Centre')
      .and.to.include('PO Box 10447')
      .and.to.include('Nottingham')
      .and.to.include('NG2 9QN');

    if (verifyContactDetails) {
      expect(html).to.include('divorcecase@justice.gov.uk');
    }
  },
  testDivorceUnitWithStreetDetailsRender(html, verifyContactDetails = true) {
    expect(html).to.include('North West Regional Divorce Centre')
      .and.to.include('Vernon Street')
      .and.to.include('Liverpool')
      .and.to.include('L2 2BX');

    if (verifyContactDetails) {
      expect(html).to.include('family@liverpool.countycourt.gsi.gov.uk');
    }
    expect(html).to.not.include('Courts and Tribunals Service Centre');
  }
};
