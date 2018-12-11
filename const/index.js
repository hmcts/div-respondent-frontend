const CaseStates = Object.freeze({
  AosAwaiting: 'AosAwaiting',
  AosStarted: 'AosStarted',
  AosOverdue: 'AosOverdue',
  AosSubmittedAwaitingAnswer: 'AosSubmittedAwaitingAnswer',
  AmendPetition: 'AmendPetition',
  AwaitingClarification: 'AwaitingClarification',
  AwaitingConsideration: 'AwaitingConsideration',
  AwaitingDecreeAbsolute: 'AwaitingDecreeAbsolute',
  AwaitingDecreeNisi: 'AwaitingDecreeNisi',
  AwaitingLegalAdvisorReferral: 'AwaitingLegalAdvisorReferral',
  AwaitingPronouncement: 'AwaitingPronouncement',
  AwaitingReissue: 'AwaitingReissue',
  DefendedDivorce: 'DefendedDivorce',
  DivorceGranted: 'DivorceGranted'
});

module.exports = { CaseStates };
