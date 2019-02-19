/* eslint-disable max-len, max-lines */
const modulePath = 'steps/correspondent/cr-done/CrDone.step';
const CrDone = require(modulePath);
const idam = require('services/idam');
const httpStatus = require('http-status-codes');
const { custom, expect, middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');
const { buildSessionWithCourtsInfo,
  testDivorceUnitDetailsRender,
  testDivorceUnitWithStreetDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect and idam.logout middleware', () => {
    return middleware.hasMiddleware(CrDone, [ idam.protect(), idam.logout() ]);
  });


  it('renders the content if the costs are not being claimed', () => {
    const session = {
      originalPetition: {
        claimsCosts: 'No'
      }
    };
    const ignoreContent = [
      'claimedCostsTitle',
      'claimedCostsText',
      'objectingToCostsOrderTitle',
      'objectingToCostsOrderText1',
      'objectingToCostsOrderText2',
      'continue',
      'backLink',
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'responseSent',
      'referenceNumber',
      'emailConfirmation',
      'whatHappensNext',
      'yourResponse',
      'guidance'
    ];
    return content(CrDone, session, { ignoreContent });
  });

  it('renders the content if the costs are being claimed', () => {
    const session = {
      originalPetition: {
        claimsCosts: 'Yes'
      }
    };
    const ignoreContent = [
      'continue',
      'backLink',
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'responseSent',
      'referenceNumber',
      'emailConfirmation',
      'whatHappensNext',
      'yourResponse',
      'guidance'
    ];
    return content(CrDone, session, { ignoreContent });
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
            const rightHandSideMenu = $('.column-one-third').html();

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
            const rightHandSideMenu = $('.column-one-third').html();

            testCTSCDetailsRender(rightHandSideMenu);
          });
      });
    });

    describe('when service centre handles case', () => {
      const session = buildSessionWithCourtsInfo('northWest');

      it('some contents should exist', () => {
        return custom(CrDone)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.column-one-third').html();
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
            const rightHandSideMenu = $('.column-one-third').html();
            expect(rightHandSideMenu).to.include('Guidance on GOV.UK')
              .and.to.include('Responding to a divorce application')
              .and.to.include('Decree nisi')
              .and.to.include('Decree absolute')
              .and.to.include('Children and divorce')
              .and.to.include('Money and property');
          });
      });
    });
  });
});