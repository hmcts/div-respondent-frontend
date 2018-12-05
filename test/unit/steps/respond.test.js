const modulePath = 'steps/respond/Respond.step';

const Respond = require(modulePath);
const ReviewApplication = require('steps/review-application/ReviewApplication.step');
const idam = require('services/idam');
const { custom, expect,
  middleware, interstitial,
  sinon, content } = require('@hmcts/one-per-page-test-suite');
const petitionMiddleware = require('middleware/petitionMiddleware');
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
  });

  afterEach(() => {
    idam.protect.restore();
    petitionMiddleware.loadMiniPetition.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(Respond, [idam.protect()]);
  });

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(Respond, ReviewApplication);
  });

  it('renders the content', () => {
    return content(Respond, {}, {
      ignoreContent: [
        'isThereAProblemWithThisPage',
        'isThereAProblemWithThisPageParagraph',
        'isThereAProblemWithThisPagePhone',
        'isThereAProblemWithThisPageEmail',
        'backLink',
        'divorceCenterUrl'
      ]
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

    describe('when service centre handles case', () => {
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
  });
});