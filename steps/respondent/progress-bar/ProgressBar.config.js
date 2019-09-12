const config = require('config');

const caseStates = config.caseStates;

const progressStates = {
  progressedNoAos: 'progressedNoAos',
  progressedUndefended: 'progressedUndefended',
  awaitingAnswer: 'awaitingAnswer',
  defendedDivorce: 'defendedDivorce',
  awaitingPronouncement: 'awaitingPronouncement',
  awaitingDecreeAbsolute: 'awaitingDecreeAbsolute',
  dnPronounced: 'dnPronounced',
  aosAwaitingSol: 'aosAwaitingSol',
  other: 'other'
};

const values = {
  yes: 'Yes',
  no: 'No'
};

const caseStateMap = [
  {
    template: './sections/OneCircleFilledIn.html',
    state: ['AwaitingReissue']
  },
  {
    template: './sections/OneCircleFilledInBold.html',
    state: ['AosAwaiting', 'AosStarted', 'AosOverdue']
  },
  {
    template: './sections/SolicitorOneCircleFilledInBold.html',
    state: ['AosAwaitingSol']
  },
  {
    template: './sections/TwoCircleFilledIn.html',
    state: ['AosSubmittedAwaitingAnswer', 'DefendedDivorce', 'AwaitingLegalAdvisorReferral', 'AmendPetition', 'AwaitingConsideration', 'AwaitingClarification', 'AwaitingPronouncement', 'AosCompleted']
  },
  {
    template: './sections/TwoCircleFilledInBold.html',
    state: ['AwaitingDecreeNisi', 'DNAwaiting', 'DNDrafted']
  },
  {
    template: './sections/ThreeCircleFilledInBold.html',
    state: ['AwaitingDecreeAbsolute', 'DNPronounced']
  },
  {
    template: './sections/FourCircleFilledIn.html',
    state: ['DivorceGranted']
  }
];

const caseStatesBeyondAos = [
  caseStates.AwaitingLegalAdvisorReferral,
  caseStates.AmendPetition,
  caseStates.AwaitingClarification,
  caseStates.AwaitingConsideration,
  caseStates.AwaitingDecreeAbsolute,
  caseStates.DNPronounced,
  caseStates.DNAwaiting,
  caseStates.DNDrafted,
  caseStates.AwaitingReissue,
  caseStates.DivorceGranted,
  caseStates.AwaitingPronouncement
];

module.exports = { progressStates, values, caseStateMap, caseStatesBeyondAos };