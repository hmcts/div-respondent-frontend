const modulePath = 'steps/correspondent/cr-respond/CrRespond.step';
const CrRespond = require(modulePath);
const CrReviewApplication = require(
  'steps/correspondent/cr-review-application/CrReviewApplication.step'
);
const idam = require('services/idam');
const { custom, expect,
  middleware, interstitial,
  sinon, content } = require('@hmcts/one-per-page-test-suite');

const feesAndPaymentsService = require('services/feesAndPaymentsService');
const httpStatus = require('http-status-codes');
const { buildSessionWithCourtsInfo,
  testDivorceUnitDetailsRender,
  testDivorceUnitWithStreetDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'get').withArgs('petition-issue-fee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 550.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    feesAndPaymentsService.get.restore();
  });

  it('has middleware', () => {
    return middleware.hasMiddleware(CrRespond,
      [idam.protect()]
    );
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    const session = {
      originalPetition: {
        jurisdictionConnection: {}
      }
    };
    return content(
      CrRespond,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'petition-issue-fee');
    });
  });

  it('redirects to next page', () => {
    return interstitial.navigatesToNext(CrRespond, CrReviewApplication);
  });

  it('renders the content', () => {
    return content(CrRespond, {}, {
      ignoreContent: [
        'isThereAProblemWithThisPage',
        'isThereAProblemWithThisPageParagraph',
        'isThereAProblemWithThisPagePhone',
        'isThereAProblemWithThisPageEmail',
        'backLink',
        'divorceCenterUrl',
        'guidance'
      ]
    });
  });

  describe('court address details', () => {
    describe('when divorce unit handles case', () => {
      const session = buildSessionWithCourtsInfo('westMidlands');

      it('should render the divorce unit info', () => {
        return custom(CrRespond)
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
        return custom(CrRespond)
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
        return custom(CrRespond)
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
        return custom(CrRespond)
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