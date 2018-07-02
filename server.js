const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const app = require('./app');
const config = require('config');
const path = require('path');
const https = require('https');
const fs = require('fs');
const appInsights = require('./services/app-insights');

appInsights();

let http = {};

if (['development'].includes(config.environment)) {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');

  const sslOptions = {
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
  };

  const server = https.createServer(sslOptions, app);

  http = server.listen(config.node.port);
} else {
  http = app.listen(config.node.port);
}

logger.info(`Application running: ${config.node.baseUrl}`);

process.on('SIGTERM', () => {
  http.close(() => {
    process.exit(0); // eslint-disable-line no-process-exit
  });
});
