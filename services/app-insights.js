const config = require('config');
const appInsights = require('applicationinsights');

const start = () => {
  if (config.services.applicationInsights.instrumentationKey) {
    appInsights.setup(config.services.applicationInsights.instrumentationKey)
      .setAutoCollectConsole(true, true);
    appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = 'div-rfe';

    appInsights.defaultClient.addTelemetryProcessor(() => {
      return true;
    });
    appInsights.start();
  }
};

module.exports = start;
