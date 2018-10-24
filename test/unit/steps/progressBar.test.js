const modulePath = 'steps/progress-bar/ProgressBar.step';
const ProgressBar = require(modulePath);
const progressBarContent = require('steps/progress-bar/ProgressBar.content');
const idam = require('services/idam');
const { middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ProgressBar, [idam.protect()]);
  });

  it('renders the content for no AoS response', () => {
    // case has progressed without respondent AoS
    const session = {
      caseState: 'AwaitingConsiderationDN',
      originalPetition: {
        respDefendsDivorce: null
      }
    };

    return content(ProgressBar, session, {
      specificValues: [ progressBarContent.en.progressedNoAos.heading ],
      specificValuesToNotExist: [ progressBarContent.en.progressedUndefended.heading ]
    });
  });

  it('renders the content for AoS and not defending', () => {
    // case has progressed with AoS, respondent is not defending
    const session = {
      caseState: 'AwaitingConsiderationDN',
      originalPetition: {
        respDefendsDivorce: 'no'
      }
    };

    return content(ProgressBar, session, {
      specificValues: [ progressBarContent.en.progressedUndefended.heading ],
      specificValuesToNotExist: [ progressBarContent.en.progressedNoAos.heading ]
    });
  });

  it('renders the content for awaiting answer, defended', () => {
    // case has progressed with AoS, court is awaiting defence answer
    const session = {
      caseState: 'AwaitingAnswer',
      originalPetition: {
        respDefendsDivorce: 'yes'
      }
    };

    return content(ProgressBar, session, {
      specificValues: [ progressBarContent.en.awaitingAnswer.heading ],
      specificValuesToNotExist: [
        progressBarContent.en.progressedNoAos.heading,
        progressBarContent.en.progressedUndefended.heading
      ]
    });
  });

  it('renders the content AoS complete, defence answered', () => {
    // case has progressed with AoS, court has received respondents defence answer
    const session = {
      caseState: 'DefendedDivorce',
      originalPetition: {
        respDefendsDivorce: 'yes'
      }
    };

    return content(ProgressBar, session, {
      specificValues: [ progressBarContent.en.defendedDivorce.heading ],
      specificValuesToNotExist: [
        progressBarContent.en.progressedNoAos.heading,
        progressBarContent.en.awaitingAnswer.heading
      ]
    });
  });

  it('renders the content for unhandled state', () => {
    const session = {
      caseState: 'UnhandledState',
      originalPetition: {
        respDefendsDivorce: 'yes'
      }
    };

    return content(ProgressBar, session, {
      specificValues: [ progressBarContent.en.other.heading ]
    });
  });
});
