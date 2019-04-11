const modulePath = 'steps/respondent/progress-bar/ProgressBar.step';
const ProgressBar = require(modulePath);
const progressBarContent = require('steps/respondent/progress-bar/ProgressBar.content');
const idam = require('services/idam');
const { custom, expect, middleware,
  sinon, content, stepAsInstance } = require('@hmcts/one-per-page-test-suite');
const config = require('config');
const httpStatus = require('http-status-codes');
const { buildSessionWithCourtsInfo,
  testDivorceUnitDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');
const moment = require('moment');

const templates = {
  awaitingReissue: './sections/OneCircleFilledIn.html',
  aosAwaiting: './sections/OneCircleFilledInBold.html',
  defendedDivorce: './sections/TwoCircleFilledIn.html',
  awaitingDecreeNisi: './sections/TwoCircleFilledInBold.html',
  awaitingDecreeAbsolute: './sections/ThreeCircleFilledInBold.html',
  divorceGranted: './sections/FourCircleFilledIn.html',
  awaitingPronouncement: './sections/TwoCircleFilledIn.html'
};


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
        respWillDefendDivorce: null
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
        respWillDefendDivorce: 'No'
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
        respWillDefendDivorce: 'Yes'
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
        respWillDefendDivorce: 'Yes'
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

  it('renders the content awaitingPronouncement and hearingAssigned', () => {
    // case has progressed with AoS, court has received respondents defence answer
    const session = {
      caseState: 'AwaitingPronouncement',
      originalPetition: {
        hearingDate: [moment().add(7, 'days')],
        D8DocumentsGenerated: [
          {
            id: 'bc6a1b97-7657-4d35-ad1d-226274be4646',
            value: { DocumentFileName: 'd8petition1539017559370699.pdf' }
          },
          {
            id: '401ab79e-34cb-4570-9f2f-4cf9357dc123',
            value: { DocumentFileName: 'certificateOfEntitlement1539017559370699.pdf' }
          }
        ]
      }
    };

    const specificContent = [
      'decreeNisiAnnouncement.heading',
      'decreeNisiAnnouncement.districtJudge',
      'decreeNisiAnnouncement.secondStage',
      'decreeNisiAnnouncement.theHearing',
      'decreeNisiAnnouncement.moreDetails',
      'decreeNisiAnnouncement.dontNeedToCome',
      'decreeNisiAnnouncement.wantToAttend',
      'downloadableFiles',
      'files.dpetition',
      'files.certificateOfEntitlement'
    ];

    return content(ProgressBar, session, { specificContent });
  });

  it('renders the content for unhandled state', () => {
    const session = {
      caseState: 'AwaitingReissue',
      originalPetition: {
        respWillDefendDivorce: 'Yes'
      }
    };

    return content(ProgressBar, session, {
      specificValues: [ progressBarContent.en.other.heading ]
    });
  });

  describe('court address details - undefended divorce', () => {
    const basicSession = {
      caseState: config.caseStates.AosSubmittedAwaitingAnswer,
      originalPetition: {
        respWillDefendDivorce: undefined
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
      caseState: 'AwaitingReissue',
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
          expect(rightHandSideMenu).to.include('Guidance on GOV.UK')
            .and.to.include('Responding to a divorce application')
            .and.to.include('Decree nisi')
            .and.to.include('Decree absolute')
            .and.to.include('Children and divorce')
            .and.to.include('Money and property');
        });
    });
  });

  // Test if all progressbar templates are rendered properly

  describe('CCD state: AwaitingReissue', () => {
    const session = {
      caseState: 'AwaitingReissue'
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingReissue);
    });
  });

  describe('CCD state: AwaitingReissue', () => {
    const session = {
      caseState: 'AosAwaiting'
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.aosAwaiting);
    });
  });

  describe('CCD state: DefendedDivorce', () => {
    const session = {
      caseState: 'DefendedDivorce'
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.defendedDivorce);
    });
  });

  describe('CCD state: AwaitingDecreeNisi', () => {
    const session = {
      caseState: 'AwaitingDecreeNisi'
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingDecreeNisi);
    });
  });

  describe('CCD state: AwaitingDecreeAbsolute', () => {
    const session = {
      caseState: 'AwaitingDecreeAbsolute'
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingDecreeAbsolute);
    });
  });

  describe('CCD state: DivorceGranted', () => {
    const session = {
      caseState: 'DivorceGranted'
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.divorceGranted);
    });
  });

  describe('CCD state: awaitingPronouncement', () => {
    let session = {};

    beforeEach(() => {
      session = {
        caseState: 'AwaitingPronouncement',
        originalPetition: {
          hearingDate: [moment().add(7, 'days')]
        }
      };
    });

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingPronouncement);
    });

    it('returns the correct files', () => {
      session.originalPetition.D8DocumentsGenerated = [
        {
          id: 'bc6a1b97-7657-4d35-ad1d-226274be4646',
          value: {
            DocumentFileName: 'd8petition.pdf'
          }
        },
        {
          id: '401ab79e-34cb-4570-9f2f-4cf9357dc123',
          value: {
            DocumentFileName: 'certificateOfEntitlement.pdf'
          }
        },
        {
          id: '401ab79e-34cb-4570-9f2f-4cf9357dc123',
          value: {
            DocumentFileName: 'shouldNotBeThere.pdf'
          }
        }
      ];
      const instance = stepAsInstance(ProgressBar, session);

      const fileTypes = instance.downloadableFiles.map(file => {
        return file.type;
      });

      expect(fileTypes).to.eql([
        'dpetition',
        'certificateOfEntitlement'
      ]);
    });
  });
});