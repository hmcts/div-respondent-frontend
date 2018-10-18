const CaseStates = Object.freeze({
  AosStarted: 'AosStarted',
  AosCompleted: 'AosCompleted',
  AwaitingLegalAdvisorReferral: 'AwaitingLegalAdvisorReferral',
  AwaitingConsiderationDN: 'AwaitingConsiderationDN',
  AwaitingClarification: 'AwaitingClarification',
  AwaitingListing: 'AwaitingListing',
  AwaitingPronouncement: 'AwaitingPronouncement',
  AwaitingAnswer: 'AwaitingAnswer',
  DefendedDivorce: 'DefendedDivorce'
});

module.exports = { CaseStates };
