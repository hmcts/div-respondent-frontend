const modulePath = 'steps/respondent/respond/Respond.step';

const Respond = require(modulePath);
const ReviewApplication = require('steps/respondent/review-application/ReviewApplication.step');
const idam = require('services/idam');
const { custom, expect,
  middleware, interstitial,
  sinon, content } = require('@hmcts/one-per-page-test-suite');
const petitionMiddleware = require('middleware/petitionMiddleware');
const redirectMiddleware = require('middleware/redirectMiddleware');

const httpStatus = require('http-status-codes');
const { buildSessionWithCourtsInfo,
  testDivorceUnitDetailsRender,
  testDivorceUnitWithStreetDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(petitionMiddleware, 'loadMiniPetition')
      .callsFake(middleware.nextMock);
    sinon.stub(redirectMiddleware, 'redirectOnCondition')
      .callsFake(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
    petitionMiddleware.loadMiniPetition.restore();
    redirectMiddleware.redirectOnCondition.restore();
  });

  it('has middleware', () => {
    return middleware.hasMiddleware(Respond,
      [
        idam.protect(),
        petitionMiddleware.loadMiniPetition,
        redirectMiddleware.redirectOnCondition
      ]
    );
  });

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(Respond, ReviewApplication);
  });

  describe('renders the content', () => {
    const ignoreContent = [
      'isThereAProblemWithThisPage',
      'isThereAProblemWithThisPageParagraph',
      'isThereAProblemWithThisPagePhone',
      'isThereAProblemWithThisPageEmail',
      'backLink',
      'divorceCenterUrl',
      'guidance'
    ];

    it('should render contents when previousCaseId is not specified', () => {
      return content(Respond, {
        divorceWho: 'husband'
      }, {
        ignoreContent,
        specificContent: ['respondToApplication']
      });
    });

    it('should render contents when previousCaseId is null', () => {
      return content(Respond, {
        divorceWho: 'husband',
        originalPetition: {
          previousCaseId: null
        }
      }, {
        ignoreContent,
        specificContent: ['respondToApplication']
      });
    });

    it('should render contents when case was amended', () => {
      return content(Respond, {
        divorceWho: 'husband',
        originalPetition: {
          previousCaseId: '12345'
        }
      }, {
        ignoreContent,
        specificContent: ['respondToAmendedApplication']
      });
    });
  });

  describe('court address details', () => {
    describe('when divorce unit handles case', () => {
      const session = buildSessionWithCourtsInfo('westMidlands');

      it('should render the divorce unit info', () => {
        return custom(Respond)
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
        return custom(Respond)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.column-one-third').html();

            testCTSCDetailsRender(rightHandSideMenu);
          });
      });
    });

    describe('when RDC handles case', () => {
      const session = buildSessionWithCourtsInfo('northWest');

      it('some contents should exist', () => {
        return custom(Respond)
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
        return custom(Respond)
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