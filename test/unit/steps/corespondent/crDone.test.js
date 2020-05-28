/* eslint-disable max-len, max-lines */
const modulePath = 'steps/co-respondent/cr-done/CrDone.step';
const CrDone = require(modulePath);
const idam = require('services/idam');
const httpStatus = require('http-status-codes');
const { custom, expect, middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');
const { buildSessionWithCourtsInfo,
  testDivorceUnitDetailsRender,
  testDivorceUnitWithStreetDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');
const feesAndPaymentsService = require('services/feesAndPaymentsService');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'get').withArgs('defended-petition-fee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 245.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    feesAndPaymentsService.get.restore();
  });

  it('has idam.protect and idam.logout middleware', () => {
    return middleware.hasMiddleware(CrDone, [ idam.protect(), idam.logout() ]);
  });

  it('renders content', () => {
    const session = {
      originalPetition: {
        claimsCosts: 'Yes'
      },
      CrChooseAResponse: {
        response: 'defend'
      }
    };

    const ignoreContent = [
      'whatHappensNext',
      'yourResponse',
      'continue',
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'backLink',
      'isThereAProblemWithThisPage',
      'phoneToCallIfProblems',
      'emailIfProblems',
      'signIn',
      'signOut',
      'languageToggle',
      'thereWasAProblem',
      'change'
    ];

    return content(CrDone, session, { ignoreContent });
  });

  it('renders content if co-respondent is defending', () => {
    const session = {
      originalPetition: {
        claimsCosts: 'No'
      },
      CrChooseAResponse: {
        response: 'defend'
      }
    };

    const specificContent = [
      'whatYouNeedToDoNow',
      'submitAnswerToDivorce',
      'fillInPaperForm',
      'postFormTo',
      'feeToPay',
      'hearingAboutDivorce',
      'dontSubmitAnswer'
    ];

    return content(CrDone, session, { specificContent });
  });

  it('renders content if co-respondent is not defending', () => {
    const session = {
      originalPetition: {
        claimsCosts: 'No'
      }
    };

    const specificContent = [
      'whatHappensNext',
      'yourResponse'
    ];

    return content(CrDone, session, { specificContent });
  });

  it('renders the content if the costs are being claimed', () => {
    const session = {
      originalPetition: {
        claimsCosts: 'Yes'
      }
    };

    const ignoreContent = [
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours'
    ];

    const specificContent = [
      'claimedCostsTitle',
      'claimedCostsText',
      'objectingToCostsOrderTitle',
      'objectingToCostsOrderText1',
      'objectingToCostsOrderText2'
    ];

    return content(CrDone, session, { specificContent, ignoreContent });
  });

  describe('court address details', () => {
    describe('when divorce unit handles case', () => {
      const session = buildSessionWithCourtsInfo('westMidlands');

      it('should render the divorce unit info', () => {
        return custom(CrDone)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.govuk-grid-column-one-third').html();

            expect(rightHandSideMenu).to.include('Your divorce centre');
            testDivorceUnitDetailsRender(rightHandSideMenu);
          });
      });
    });

    describe('when service centre handles case', () => {
      const session = buildSessionWithCourtsInfo('serviceCentre');

      it('some contents should exist', () => {
        return custom(CrDone)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.govuk-grid-column-one-third').html();

            testCTSCDetailsRender(rightHandSideMenu);
          });
      });
    });

    describe('when RDC handles case', () => {
      const session = buildSessionWithCourtsInfo('northWest');

      it('some contents should exist', () => {
        return custom(CrDone)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.govuk-grid-column-one-third').html();
            testDivorceUnitWithStreetDetailsRender(rightHandSideMenu);
          });
      });
    });

    describe('right hand side menu rendering', () => {
      const session = {};

      it('should render guidance links', () => {
        return custom(CrDone)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.govuk-grid-column-one-third').html();
            expect(rightHandSideMenu).to.include('Guidance on GOV.UK')
              .and.to.include('How to respond to a divorce application')
              .and.to.include('Decree nisi')
              .and.to.include('Children and divorce')
              .and.to.include('Money and property');
          });
      });
    });
  });
});
