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
        respDefendsDivorce: 'no'
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
      'defendedText6'
    ];

    return content(doneStep, session, { ignoreContent });
  });

  it('renders the content if the divorce is defended', () => {
    const session = {
      ChooseAResponse: {
        respDefendsDivorce: 'yes'
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
      'notDefendedListItem2'
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
          respDefendsDivorce: 'yes'
        },
        divorceCenterName: 'East Midlands Regional Divorce Centre',
        divorceCenterPoBox: 'PO Box 10447',
        divorceCenterCourtCity: 'Nottingham',
        divorceCenterPostCode: 'NG2 9QN',
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
            session.originalPetition.respEmailAddress
          ]
        }
      );
    });
  });
});