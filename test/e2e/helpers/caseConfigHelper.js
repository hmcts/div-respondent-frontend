let testCaseId = '';

const setTestCaseId = caseId => {
  testCaseId = caseId;
};

const getTestCaseId = () => {
  return testCaseId.toString();
};

module.exports = {
  setTestCaseId,
  getTestCaseId
};
