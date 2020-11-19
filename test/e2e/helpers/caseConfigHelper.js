let testCaseId = '';

const setTestCaseId = caseId => {
  testCaseId = caseId;
};

const getTestCaseId = () => {
  return testCaseId.toString();
};

function merge(intoObject, fromObject) {
  return Object.assign({}, intoObject, fromObject);
}

module.exports = {
  setTestCaseId,
  getTestCaseId,
  merge
};
