const modulePath = 'steps/progress-bar/ProgressBar.step';
const ProgressBar = require(modulePath);
const progressBarContent = require('steps/progress-bar/ProgressBar.content');
const idam = require('services/idam');
const { custom, expect, middleware, sinon, content } = require('@hmcts/one-per-page-test-suite');
const { CaseStates } = require('const');
const httpStatus = require('http-status-codes');
const { buildSessionWithCourtsInfo,
  testDivorceUnitDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');

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
      caseState: 'AwaitingLegalAdvisorReferral',
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
      caseState: 'AwaitingLegalAdvisorReferral',
      originalPetition: {
        respDefendsDivorce: 'No'
      }
    };

    return content(ProgressBar, session, {
      specificValues: [ progressBarContent.en.progressedUndefended.heading ]
    });
  });

  it('renders the content for awaiting answer, defended', () => {
    // case has progressed with AoS, court is awaiting defence answer
    const session = {
      caseState: 'AosSubmittedAwaitingAnswer',
      originalPetition: {
        respDefendsDivorce: 'Yes'
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
        respDefendsDivorce: 'Yes'
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
        respDefendsDivorce: 'Yes'
      }
    };

    return content(ProgressBar, session, {
      specificValues: [ progressBarContent.en.other.heading ]
    });
  });

  describe('court address details - undefended divorce', () => {
    const basicSession = {
      caseState: CaseStates.AosSubmittedAwaitingAnswer,
      originalPetition: {
        respDefendsDivorce: undefined
      }
    };

    describe('when divorce unit handles case', () => {
      const testCaseSession = Object.assign({}, basicSession,
        buildSessionWithCourtsInfo('westMidlands'));

      it('should render the divorce unit info', () => {
        return custom(ProgressBar)
          .withSession(testCaseSession)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.column-one-third').html();
            const mainPage = $('.column-two-thirds').html();

            expect(rightHandSideMenu).to.include('Your divorce centre');
            testDivorceUnitDetailsRender(rightHandSideMenu);
            testDivorceUnitDetailsRender(mainPage, false);
          });
      });
    });

    describe('when service centre handles case', () => {
      const testCaseSession = Object.assign({}, basicSession,
        buildSessionWithCourtsInfo('serviceCentre'));

      it('should render the service centre info', () => {
        return custom(ProgressBar)
          .withSession(testCaseSession)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.column-one-third').html();
            const mainPage = $('.column-two-thirds').html();

            testCTSCDetailsRender(rightHandSideMenu);
            testCTSCDetailsRender(mainPage);
          });
      });
    });
  });

  describe('right hand side menu rendering', () => {
    const session = {
      divorceWho: 'husband',
      originalPetition: {
      }
    };

    it('should render guidance links', () => {
      return custom(ProgressBar)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const rightHandSideMenu = $('.column-one-third').html();
          expect(rightHandSideMenu).to.include(`How your ${session.divorceWho} responds`)
            .and.to.include('Decree nisi')
            .and.to.include('Decree absolute')
            .and.to.include('Children and divorce')
            .and.to.include('Money and property');
        });
    });
  });
});