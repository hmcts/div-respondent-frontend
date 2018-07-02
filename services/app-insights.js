const config = require('config');
const appInsights = require('applicationinsights');

const start = () => {
  if (config.services.applicationInsights.instrumentationKey) {
    appInsights.setup(config.services.applicationInsights.instrumentationKey)
      .setAutoCollectConsole(true, true)
      .start();
  }
};

module.exports = start;
