const exampleStep = require('steps/respondent/progress-bar/ProgressBar.step');
const { custom, expect, sinon, middleware } = require('@hmcts/one-per-page-test-suite');
const idam = require('services/idam');
const httpStatus = require('http-status-codes');

describe('Google analytics', () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('should to be injected into the page', () => {
    const session = {
      caseState: 'AwaitingLegalAdvisorReferral',
      originalPetition: {
        respDefendsDivorce: null
      }
    };
    const googleAnalyticsId = 'google-analytics-id';
    return custom(exampleStep)
      .withGlobal('googleAnalyticsId', googleAnalyticsId)
      .withSetup(req => {
        req.session.generate();
        return Object.assign(req.session, session);
      })
      .get()
      .expect(httpStatus.OK)
      .text(pageContent => {
        const googleAnalyticsCodeExists = pageContent.includes('<!-- Google Analytics -->');
        const googleAnalyticsIdExists = pageContent.includes(googleAnalyticsId);
        expect(googleAnalyticsCodeExists).to.eql(true);
        return expect(googleAnalyticsIdExists).to.eql(true);
      });
  });
});
