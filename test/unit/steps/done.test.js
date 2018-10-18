/* eslint-disable max-len */
const modulePath = 'steps/done/Done.step';
const doneStep = require(modulePath);
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect and user data middleware', () => {
    return middleware.hasMiddleware(doneStep, [idam.protect()]);
  });

  it('renders the content if the divorce is not defended', () => {
    const session = {
      ChooseAResponse: {
        response: 'proceed'
      }
    };
    const ignoreContent = [
      'continue',
      'backLink',
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'defendedHeading',
      'defendedText1',
      'defendedText2',
      'defendedText3',
      'defendedText4',
      'defendedText5',
      'defendedText6',
      'notDefendedAdultery1',
      'notDefendedAdultery2',
      'notDefendedAdulteryLi1',
      'notDefendedAdulteryLi2',
      'notDefendedAdultery3',
      'notDefended2YearsNoConsent',
      'notDefended2YearsNoConsent1',
      'notDefended2YearsNoConsent2',
      'notDefended2YearsNoConsent3',
      'notDefended2YearsNoConsentH2',
      'notDefended2YearsNoConsent4'
    ];
    return content(doneStep, session, { ignoreContent });
  });

  it('renders the content if the divorce is not defended and the reason is 2 years separation-2-years', () => {
    const session = {
      ConsentDecree: {
        response: {
          consentDecree: 'yes'
        }
      }
    };
    const ignoreContent = [
      'continue',
      'backLink',
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'defendedHeading',
      'defendedText1',
      'defendedText2',
      'defendedText3',
      'defendedText4',
      'defendedText5',
      'defendedText6',
      'notDefendedAdultery1',
      'notDefendedAdultery2',
      'notDefendedAdulteryLi1',
      'notDefendedAdulteryLi2',
      'notDefendedAdultery3',
      'notDefended2YearsNoConsent',
      'notDefended2YearsNoConsent1',
      'notDefended2YearsNoConsent2',
      'notDefended2YearsNoConsent3',
      'notDefended2YearsNoConsentH2',
      'notDefended2YearsNoConsent4'
    ];
    return content(doneStep, session, { ignoreContent });
  });


  it('renders the content if the divorce is not defended you do not accept the allegations made in the application', () => {
    const session = {
      ChooseAResponse: {
        response: 'proceedButDisagree'
      }
    };
    const ignoreContent = [
      'continue',
      'backLink',
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'defendedHeading',
      'defendedText1',
      'defendedText2',
      'defendedText3',
      'defendedText4',
      'defendedText5',
      'defendedText6',
      'notDefendedAdultery1',
      'notDefendedAdultery2',
      'notDefendedAdulteryLi1',
      'notDefendedAdulteryLi2',
      'notDefendedAdultery3',
      'notDefended2YearsNoConsent',
      'notDefended2YearsNoConsent1',
      'notDefended2YearsNoConsent2',
      'notDefended2YearsNoConsent3',
      'notDefended2YearsNoConsentH2',
      'notDefended2YearsNoConsent4'
    ];
    return content(doneStep, session, { ignoreContent });
  });

  it('renders the content if the divorce is not defended, reason for divorce is adultery and adultery is not addmitted.', () => {
    const session = {
      ChooseAResponse: {
        response: 'proceed'
      },
      originalPetition: {
        reasonForDivorce: 'adultery'
      },
      AdmitAdultery: {
        response: 'doNotAdmit'
      }
    };
    const ignoreContent = [
      'continue',
      'backLink',
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'defendedHeading',
      'defendedText1',
      'defendedText2',
      'defendedText3',
      'defendedText4',
      'defendedText5',
      'defendedText6',
      'notDefended2YearsNoConsent',
      'notDefended2YearsNoConsent1',
      'notDefended2YearsNoConsent2',
      'notDefended2YearsNoConsent3',
      'notDefended2YearsNoConsentH2',
      'notDefended2YearsNoConsent4',
      'notDefendedText1',
      'notDefendedText2',
      'notDefendedText3',
      'notDefendedText4',
      'notDefendedText5',
      'notDefendedListItem1',
      'notDefendedListItem2'
    ];
    return content(doneStep, session, { ignoreContent });
  });

  it('renders the content if the divorce is not defended, reason for divorce is separation-2-years and no consent.', () => {
    const session = {
      ConsentDecree: {
        response: {
          consentDecree: 'no',
          willDefend: 'no'
        }
      },
      originalPetition: {
        reasonForDivorce: 'separation-2-years'
      }
    };
    const ignoreContent = [
      'continue',
      'backLink',
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'defendedHeading',
      'defendedText1',
      'defendedText2',
      'defendedText3',
      'defendedText4',
      'defendedText5',
      'defendedText6',
      'notDefendedText1',
      'notDefendedText2',
      'notDefendedText3',
      'notDefendedText4',
      'notDefendedText5',
      'notDefendedListItem1',
      'notDefendedListItem2',
      'notDefendedAdultery1',
      'notDefendedAdultery2',
      'notDefendedAdulteryLi1',
      'notDefendedAdulteryLi2'
    ];
    return content(doneStep, session, { ignoreContent });
  });


  it('renders the content if the divorce is defended', () => {
    const session = {
      ChooseAResponse: {
        response: 'defend'
      }
    };
    const ignoreContent = [
      'continue',
      'backLink',
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'notDefendedHeading',
      'notDefendedText1',
      'notDefendedText2',
      'notDefendedText3',
      'notDefendedText4',
      'notDefendedText5',
      'notDefendedListItem1',
      'notDefendedListItem2',
      'notDefendedAdultery1',
      'notDefendedAdultery2',
      'notDefendedAdulteryLi1',
      'notDefendedAdulteryLi2',
      'notDefendedAdultery3',
      'notDefended2YearsNoConsent',
      'notDefended2YearsNoConsent1',
      'notDefended2YearsNoConsent2',
      'notDefended2YearsNoConsent3',
      'notDefended2YearsNoConsentH2',
      'notDefended2YearsNoConsent4'
    ];
    return content(doneStep, session, { ignoreContent });
  });

  describe('values', () => {
    it('displays reference number', () => {
      const referenceNumber = '1234 ‐ 5678 ‐ 9012 ‐ 4567';
      const session = {
        referenceNumber: referenceNumber.replace(/ ‐ /g, '')
      };
      return content(
        doneStep,
        session,
        {
          specificValues: [ referenceNumber ]
        }
      );
    });

    it('displays divorce center name, po box, city, post code petitioner email address', () => {
      const session = {
        ChooseAResponse: {
          response: 'defend'
        },
        divorceCenterName: 'East Midlands Regional Divorce Centre',
        divorceCenterPoBox: 'PO Box 10447',
        divorceCenterCourtCity: 'Nottingham',
        divorceCenterPostCode: 'NG2 9QN',
        divorceCenterStreet: '21 Jump Street',
        originalPetition: {
          respEmailAddress: 'test@test.com'
        }
      };
      return content(
        doneStep,
        session,
        {
          specificValues: [
            session.divorceCenterName,
            session.divorceCenterPoBox,
            session.divorceCenterCourtCity,
            session.divorceCenterPostCode,
            session.divorceCenterStreet,
            session.originalPetition.respEmailAddress
          ]
        }
      );
    });
  });
});