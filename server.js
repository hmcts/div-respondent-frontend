require('./services/app-insights')();
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const app = require('./app');
const config = require('config');
const path = require('path');
const https = require('https');
const fs = require('fs');
const testHttp = require('http');

let http = {};

const startMockServer = () => {
  const mocksPort = '1111';
  testHttp.createServer((request, response) => {
    response.writeHead(200, { // eslint-disable-line no-magic-numbers
      'Content-Type': 'text/json',
      'Access-Control-Allow-Origin': '*',
      'X-Powered-By': 'nodejs'
    });
    fs.readFile('resources/raw-response-mock.json', (err, content) => { // eslint-disable-line id-blacklist
      response.write(content);
      response.end();
    });
  }).listen(mocksPort);
};

if (['development'].includes(config.environment)) {
  startMockServer();

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