const exampleStep = require('steps/start/Start.step');
const { custom, expect } = require('@hmcts/one-per-page-test-suite');
const httpStatus = require('http-status-codes');

describe('Google analytics', () => {
  it('should to be injected into the page', () => {
    const googleAnalyticsId = 'google-analytics-id';
    return custom(exampleStep)
      .withGlobal('googleAnalyticsId', googleAnalyticsId)
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
