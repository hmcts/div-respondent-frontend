const path = require('path');
const https = require('https');
const fs = require('fs');
const mockserver = require('mockserver');

const sslDirectory = path.join('resources', 'localhost-ssl');

const sslOptions = {
  key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
  cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
};
mockserver.headers = ['Authorization'];

function startCaseOrchestrationMock() {
  // This is a file-based mock server for local development/local E2E tests
  const port = 3001;
  const mocksPath = 'mocks/services/case-orchestration';
  https.createServer(sslOptions, mockserver(mocksPath, true))
    .listen(port);
}

startCaseOrchestrationMock();
