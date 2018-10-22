const http = require('http');
const mockserver = require('mockserver');

mockserver.headers = ['Authorization'];

function startCaseOrchestrationMock() {
  // This is a file-based mock server for local development/local E2E tests
  const port = 3001;
  const mocksPath = 'mocks/services';
  http.createServer(mockserver(mocksPath, true))
    .listen(port);
}

function startFeesAndPaymentsMock() {
  // This is a file-based mock server for local development/local E2E tests
  const port = 3002;
  const mocksPath = 'mocks/services/fees-and-payments';
  http.createServer(mockserver(mocksPath, true))
    .listen(port);
}

startCaseOrchestrationMock();
startFeesAndPaymentsMock();
