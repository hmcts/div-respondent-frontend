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
  const port = 3001;
  https.createServer(sslOptions, mockserver('mocks/services/orchestration', true))
    .listen(port);
}

startCaseOrchestrationMock();
