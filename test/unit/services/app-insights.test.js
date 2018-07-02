const modulePath = 'services/app-insights';

const appInsights = require(modulePath);
const config = require('config');
const applicationinsights = require('applicationinsights');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

const previousInstrumentationKey = config.services.applicationInsights.instrumentationKey;

let appInsightsStub = {};

describe(modulePath, () => {
  beforeEach(() => {
    appInsightsStub = {
      setAutoCollectConsole: sinon.stub(),
      start: sinon.stub()
    };
    appInsightsStub.setAutoCollectConsole.returns(appInsightsStub);
    appInsightsStub.start.returns(appInsightsStub);

    sinon.stub(applicationinsights, 'setup').returns(appInsightsStub);
  });

  afterEach(() => {
    applicationinsights.setup.restore();
  });

  after(() => {
    config.services.applicationInsights.instrumentationKey = previousInstrumentationKey;
  });

  it('starts app insights if instrumentationKey is set', () => {
    config.services.applicationInsights.instrumentationKey = 'a value';
    appInsights();
    expect(applicationinsights.setup.calledOnce).to.eql(true);
    expect(appInsightsStub.setAutoCollectConsole.calledOnce).to.eql(true);
    expect(appInsightsStub.start.calledOnce).to.eql(true);
  });

  it('does not start app insights if instrumentationKey is not set', () => {
    delete config.services.applicationInsights.instrumentationKey;
    appInsights();
    expect(applicationinsights.setup.calledOnce).to.eql(false);
    expect(appInsightsStub.setAutoCollectConsole.calledOnce).to.eql(false);
    expect(appInsightsStub.start.calledOnce).to.eql(false);
  });
});
