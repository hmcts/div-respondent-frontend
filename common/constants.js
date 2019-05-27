
module.exports = {
  caseFacts: {
    adultery: 'adultery',
    behavior: 'unreasonable-behaviour',
    coRespondent: 'correspondent',
    desertion: 'desertion',
    fiveYearSeparation: 'separation-5-years',
    twoYearSeparation: 'separation-2-years'
  },
  caseStates: {
    AosAwaiting: 'AosAwaiting',
    AosCompleted: 'AosCompleted',
    AosStarted: 'AosStarted',
    AosOverdue: 'AosOverdue',
    AosSubmittedAwaitingAnswer: 'AosSubmittedAwaitingAnswer',
    AmendPetition: 'AmendPetition',
    AwaitingClarification: 'AwaitingClarification',
    AwaitingConsideration: 'AwaitingConsideration',
    AwaitingDecreeAbsolute: 'AwaitingDecreeAbsolute',
    AwaitingDecreeNisi: 'AwaitingDecreeNisi',
    DNAwaiting: 'DNAwaiting',
    AwaitingLegalAdvisorReferral: 'AwaitingLegalAdvisorReferral',
    AwaitingPronouncement: 'AwaitingPronouncement',
    AwaitingReissue: 'AwaitingReissue',
    DefendedDivorce: 'DefendedDivorce',
    DivorceGranted: 'DivorceGranted'
  },
  coRespProgressStates: {
    defendingAwaitingAnswer: 'defendingAwaitingAnswer',
    defendingSubmittedAnswer: 'defendingSubmittedAnswer',
    notDefending: 'notDefending',
    tooLateToRespond: 'tooLateToRespond'
  },
  coRespRespondableStates: [
    'AosAwaiting',
    'AosStarted',
    'AosOverdue',
    'AosCompleted',
    'AosSubmittedAwaitingAnswer',
    'DefendedDivorce',
    'AwaitingDecreeNisi',
    'DNAwaiting',
    'AwaitingLegalAdvisorReferral'
  ],
  respProgressStates: {
    awaitingAnswer: 'awaitingAnswer',
    defendedDivorce: 'defendedDivorce',
    other: 'other',
    progressedNoAos: 'progressedNoAos',
    progressedUndefended: 'progressedUndefended'
  },
  userActions: {
    admit: 'admit',
    changeResponse: 'changeResponse',
    confirm: 'confirm',
    defend: 'defend',
    differentAmount: 'DifferentAmount',
    doNotAdmit: 'doNotAdmit',
    notAccept: 'NoNoAdmission',
    proceed: 'proceed',
    proceedButDisagree: 'proceedButDisagree',
    yesOrNo: {
      no: 'No',
      yes: 'Yes'
    }
  }
};
