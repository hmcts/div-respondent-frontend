let testCaseId = '';

const setTestCaseId = caseId => {
  testCaseId = caseId;
};

const getTestCaseId = () => {
  return testCaseId;
};

module.exports = {
  setTestCaseId,
  getTestCaseId
};
