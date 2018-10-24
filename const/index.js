const CaseStates = Object.freeze({
  AosStarted: 'AosStarted',
  AosCompleted: 'AosCompleted',
  AwaitingLegalAdvisorReferral: 'AwaitingLegalAdvisorReferral',
  AosSubmittedAwaitingAnswer: 'AosSubmittedAwaitingAnswer',
  DefendedDivorce: 'DefendedDivorce'
});

module.exports = { CaseStates };
