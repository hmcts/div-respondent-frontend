const logger = require('services/logger').getLogger(__filename);
const config = require('@hmcts/properties-volume').addTo(require('config'));
const setupSecrets = require('services/setupSecrets');

// Setup secrets before loading the app
setupSecrets();

require('./services/app-insights')();

const app = require('./app');
const path = require('path');
const https = require('https');
const fs = require('fs');

let http = {};

if (['development'].includes(config.environment)) {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl');

  const sslOptions = {
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt')),
    secureProtocol: 'TLSv1_2_method'
  };

  const server = https.createServer(sslOptions, app);

  http = server.listen(config.node.port);
} else {
  http = app.listen(config.node.port);
}

logger.infoWithReq(null, 'app_running', 'Application running', config.node.baseUrl);

process.on('SIGTERM', () => {
  http.close(() => {
    process.exit(0); // eslint-disable-line no-process-exit
  });
});
