const CaseStates = Object.freeze({
  AosAwaiting: 'AosAwaiting',
  AosStarted: 'AosStarted',
  AosOverdue: 'AosOverdue',
  AosSubmittedAwaitingAnswer: 'AosSubmittedAwaitingAnswer',
  AmendPetition: 'AmendPetition',
  AwaitingClarification: 'AwaitingClarification',
  AwaitingConsideration: 'AwaitingConsideration',
  AwaitingDecreeAbsolute: 'AwaitingDecreeAbsolute',
  DNAwaiting: 'DNAwaiting',
  AwaitingLegalAdvisorReferral: 'AwaitingLegalAdvisorReferral',
  AwaitingPronouncement: 'AwaitingPronouncement',
  AwaitingReissue: 'AwaitingReissue',
  DefendedDivorce: 'DefendedDivorce',
  DivorceGranted: 'DivorceGranted'
});

const CoRespLinkableStates = [
  'AosAwaiting',
  'AosStarted',
  'AosOverdue',
  'AosCompeted',
  'AosSubmittedAwaitingAnswer',
  'DefendedDivorce',
  'AwaitingDecreeNisi',
  'AwaitingLegalAdvisorReferral'
];

module.exports = { CaseStates, CoRespLinkableStates };
