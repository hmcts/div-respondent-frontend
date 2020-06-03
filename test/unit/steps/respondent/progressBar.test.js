/* eslint-disable max-lines */
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

const templates = {
  awaitingReissue: './sections/OneCircleFilledIn.html',
  aosAwaiting: './sections/OneCircleFilledInBold.html',
  defendedDivorce: './sections/TwoCircleFilledIn.html',
  awaitingDecreeNisi: './sections/TwoCircleFilledInBold.html',
  awaitingDecreeAbsolute: './sections/ThreeCircleFilledInBold.html',
  dnPronounced: './sections/ThreeCircleFilledInBold.html',
  divorceGranted: './sections/FourCircleFilledIn.html',
  aosAwaitingSol: './sections/SolicitorOneCircleFilledInBold.html'
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

  describe('content for Awaiting Pronouncement and hearing date', () => {
    describe('no cost order', () => {
      // case has progressed with AoS, court has received respondents defence answer
      const session = {
        caseState: 'AwaitingPronouncement',
        originalPetition: {
          hearingDate: [ '2222-01-01T00:00:00.000+0000' ]
        }
      };

      it('show correct content', () => {
        return content(ProgressBar, session, {
          specificContent: [
            'decreeNisiAnnouncement.heading',
            'decreeNisiAnnouncement.districtJudge',
            'decreeNisiAnnouncement.secondStage',
            'decreeNisiAnnouncement.theHearing',
            'decreeNisiAnnouncement.moreDetails',
            'decreeNisiAnnouncement.dontNeedToCome',
            'decreeNisiAnnouncement.wantToAttend'
          ]
        });
      });

      it('not show content', () => {
        return content(ProgressBar, session, {
          specificContentToNotExist: [
            'decreeNisiAnnouncement.acceptedCosts',
            'decreeNisiAnnouncement.wantToAttendCosts'
          ]
        });
      });
    });

    it('cost order', () => {
      // case has progressed with AoS, court has received respondents defence answer
      const session = {
        caseState: 'AwaitingPronouncement',
        originalPetition: {
          costsClaimGranted: 'Yes',
          hearingDate: [ '2222-01-01T00:00:00.000+0000' ],
          whoPaysCosts: 'respondentAndCoRespondent'
        }
      };

      return content(ProgressBar, session, {
        specificContent: [
          'decreeNisiAnnouncement.heading',
          'decreeNisiAnnouncement.districtJudge',
          'decreeNisiAnnouncement.secondStage',
          'decreeNisiAnnouncement.theHearing',
          'decreeNisiAnnouncement.moreDetails',
          'decreeNisiAnnouncement.dontNeedToCome',
          'decreeNisiAnnouncement.wantToAttend',
          'decreeNisiAnnouncement.acceptedCosts',
          'decreeNisiAnnouncement.wantToAttendCosts'
        ]
      });
    });
  });

  describe('State: AwaitingDecreeAbsolute', () => {
    const awaitingDecreeAbsoluteContent = [
      'decreeNisiGranted.heading',
      'decreeNisiGranted.dateGranted',
      'decreeNisiGranted.decreeNisi',
      'decreeNisiGranted.costsOrder',
      'decreeNisiGranted.notDivorcedYet',
      'decreeNisiGranted.divorceComplete',
      'decreeNisiGranted.sixWeeks',
      'decreeNisiGranted.courtCancel',
      'decreeNisiGranted.applyForDecreeAbsolute',
      'decreeNisiGranted.downloadDecreeNisi',
      'decreeNisiGranted.whatCostsOrder',
      'decreeNisiGranted.orderWillStateRespondent',
      'decreeNisiGranted.orderWillStateCoRespondent',
      'decreeNisiGranted.orderWillStateRespondentAndCoRespondent',
      'decreeNisiGranted.downloadCostsOrder'
    ];

    let session = {};

    beforeEach(() => {
      session = {
        caseState: 'AwaitingDecreeAbsolute',
        originalPetition: {
          decreeNisiGrantedDate: '2222-01-01T00:00:00.000+0000',
          whoPaysCosts: 'respondent',
          d8: [
            {
              id: '401ab79e-34cb-4570-9f2f-4cf9357m4st3r',
              fileName: 'costsOrder1554740111371638.pdf',
              // eslint-disable-next-line max-len
              fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f'
            },
            {
              id: '401ab79e-34cb-4570-9f2f-4cf9357m4st3r',
              fileName: 'decreeNisi1554740111371638.pdf',
              // eslint-disable-next-line max-len
              fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f'
            }
          ]
        }
      };
    });

    describe('costs order: respondent', () => {
      beforeEach(() => {
        session.originalPetition.whoPaysCosts = 'respondent';
      });

      const specificContentToNotExist = [
        'decreeNisiGranted.orderWillStateCoRespondent',
        'decreeNisiGranted.orderWillStateRespondentAndCoRespondent'
      ];

      it('renders the correct content', () => {
        const specificContent = awaitingDecreeAbsoluteContent.filter(key => {
          return !specificContentToNotExist.includes(key);
        });

        return content(ProgressBar, session, { specificContent });
      });

      it('doesnt render other content', () => {
        return content(ProgressBar, session, { specificContentToNotExist });
      });
    });

    describe('costs order: co-respondent', () => {
      beforeEach(() => {
        session.originalPetition.whoPaysCosts = 'coRespondent';
      });

      const specificContentToNotExist = [
        'decreeNisiGranted.orderWillStateRespondent',
        'decreeNisiGranted.orderWillStateRespondentAndCoRespondent'
      ];

      it('renders the correct content', () => {
        const specificContent = awaitingDecreeAbsoluteContent.filter(key => {
          return !specificContentToNotExist.includes(key);
        });

        return content(ProgressBar, session, { specificContent });
      });

      it('doesnt render other content', () => {
        return content(ProgressBar, session, { specificContentToNotExist });
      });
    });

    describe('costs order: co-respondent and respondent', () => {
      beforeEach(() => {
        session.originalPetition.whoPaysCosts = 'respondentAndCoRespondent';
      });

      const specificContentToNotExist = [
        'decreeNisiGranted.orderWillStateRespondent',
        'decreeNisiGranted.orderWillStateCoRespondent'
      ];

      it('renders the correct content', () => {
        const specificContent = awaitingDecreeAbsoluteContent.filter(key => {
          return !specificContentToNotExist.includes(key);
        });

        return content(ProgressBar, session, { specificContent });
      });

      it('doesnt render other content', () => {
        return content(ProgressBar, session, { specificContentToNotExist });
      });
    });

    describe('no cost order', () => {
      beforeEach(() => {
        delete session.originalPetition.whoPaysCosts;
        delete session.originalPetition.d8;
      });

      const specificContentToNotExist = [
        'decreeNisiGranted.costsOrder',
        'decreeNisiGranted.whatCostsOrder',
        'decreeNisiGranted.orderWillStateRespondent',
        'decreeNisiGranted.orderWillStateCoRespondent',
        'decreeNisiGranted.orderWillStateRespondentAndCoRespondent',
        'decreeNisiGranted.downloadCostsOrder'
      ];

      it('renders the correct content', () => {
        const specificContent = awaitingDecreeAbsoluteContent.filter(key => {
          return !specificContentToNotExist.includes(key);
        });

        return content(ProgressBar, session, { specificContent });
      });

      it('doesnt render other content', () => {
        return content(ProgressBar, session, { specificContentToNotExist });
      });
    });
  });

  describe('State: DNPronounced', () => {
    const awaitingDecreeAbsoluteContent = [
      'decreeNisiGranted.heading',
      'decreeNisiGranted.dateGranted',
      'decreeNisiGranted.decreeNisi',
      'decreeNisiGranted.costsOrder',
      'decreeNisiGranted.notDivorcedYet',
      'decreeNisiGranted.divorceComplete',
      'decreeNisiGranted.sixWeeks',
      'decreeNisiGranted.courtCancel',
      'decreeNisiGranted.applyForDecreeAbsolute',
      'decreeNisiGranted.downloadDecreeNisi',
      'decreeNisiGranted.whatCostsOrder',
      'decreeNisiGranted.orderWillStateRespondent',
      'decreeNisiGranted.orderWillStateCoRespondent',
      'decreeNisiGranted.orderWillStateRespondentAndCoRespondent',
      'decreeNisiGranted.downloadCostsOrder'
    ];

    let session = {};

    beforeEach(() => {
      session = {
        caseState: 'DNPronounced',
        originalPetition: {
          decreeNisiGrantedDate: '2222-01-01T00:00:00.000+0000',
          whoPaysCosts: 'respondent',
          d8: [
            {
              id: '401ab79e-34cb-4570-9f2f-4cf9357m4st3r',
              fileName: 'costsOrder1554740111371638.pdf',
              // eslint-disable-next-line max-len
              fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f'
            },
            {
              id: '401ab79e-34cb-4570-9f2f-4cf9357m4st3r',
              fileName: 'decreeNisi1554740111371638.pdf',
              // eslint-disable-next-line max-len
              fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/30acaa2f-84d7-4e27-adb3-69551560113f'
            }
          ]
        }
      };
    });

    describe('costs order: respondent', () => {
      beforeEach(() => {
        session.originalPetition.whoPaysCosts = 'respondent';
      });

      const specificContentToNotExist = [
        'decreeNisiGranted.orderWillStateCoRespondent',
        'decreeNisiGranted.orderWillStateRespondentAndCoRespondent'
      ];

      it('renders the correct content', () => {
        const specificContent = awaitingDecreeAbsoluteContent.filter(key => {
          return !specificContentToNotExist.includes(key);
        });

        return content(ProgressBar, session, { specificContent });
      });

      it('doesnt render other content', () => {
        return content(ProgressBar, session, { specificContentToNotExist });
      });
    });

    describe('costs order: co-respondent', () => {
      beforeEach(() => {
        session.originalPetition.whoPaysCosts = 'coRespondent';
      });

      const specificContentToNotExist = [
        'decreeNisiGranted.orderWillStateRespondent',
        'decreeNisiGranted.orderWillStateRespondentAndCoRespondent'
      ];

      it('renders the correct content', () => {
        const specificContent = awaitingDecreeAbsoluteContent.filter(key => {
          return !specificContentToNotExist.includes(key);
        });

        return content(ProgressBar, session, { specificContent });
      });

      it('doesnt render other content', () => {
        return content(ProgressBar, session, { specificContentToNotExist });
      });
    });

    describe('costs order: co-respondent and respondent', () => {
      beforeEach(() => {
        session.originalPetition.whoPaysCosts = 'respondentAndCoRespondent';
      });

      const specificContentToNotExist = [
        'decreeNisiGranted.orderWillStateRespondent',
        'decreeNisiGranted.orderWillStateCoRespondent'
      ];

      it('renders the correct content', () => {
        const specificContent = awaitingDecreeAbsoluteContent.filter(key => {
          return !specificContentToNotExist.includes(key);
        });

        return content(ProgressBar, session, { specificContent });
      });

      it('doesnt render other content', () => {
        return content(ProgressBar, session, { specificContentToNotExist });
      });
    });

    describe('no cost order', () => {
      beforeEach(() => {
        delete session.originalPetition.whoPaysCosts;
        delete session.originalPetition.d8;
      });

      const specificContentToNotExist = [
        'decreeNisiGranted.costsOrder',
        'decreeNisiGranted.whatCostsOrder',
        'decreeNisiGranted.orderWillStateRespondent',
        'decreeNisiGranted.orderWillStateCoRespondent',
        'decreeNisiGranted.orderWillStateRespondentAndCoRespondent',
        'decreeNisiGranted.downloadCostsOrder'
      ];

      it('renders the correct content', () => {
        const specificContent = awaitingDecreeAbsoluteContent.filter(key => {
          return !specificContentToNotExist.includes(key);
        });

        return content(ProgressBar, session, { specificContent });
      });

      it('doesnt render other content', () => {
        return content(ProgressBar, session, { specificContentToNotExist });
      });
    });
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
            const rightHandSideMenu = $('.govuk-grid-column-one-third').html();
            const mainPage = $('.govuk-grid-column-two-thirds').html();

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
            const rightHandSideMenu = $('.govuk-grid-column-one-third').html();
            const mainPage = $('.govuk-grid-column-two-thirds').html();

            testCTSCDetailsRender(rightHandSideMenu);
            testCTSCDetailsRender(mainPage);
          });
      });
    });
  });

  describe('right hand side menu rendering', () => {
    const session = {
      caseState: 'AosSubmittedAwaitingAnswer',
      originalPetition: {
        d8: [
          {
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            modifiedOn: null,
            fileName: 'd8petition1539017559370699.pdf',
            fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/',
            mimeType: null,
            status: null
          },
          {
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            modifiedOn: null,
            fileName: 'respondentAnswers.pdf',
            fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/',
            mimeType: null,
            status: null
          },
          {
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            modifiedOn: null,
            fileName: 'coRespondentAnswers.pdf',
            fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/',
            mimeType: null,
            status: null
          },
          {
            createdBy: 0,
            createdOn: null,
            lastModifiedBy: 0,
            modifiedOn: null,
            fileName: 'certificateOfEntitlement1539017559370699.pdf',
            fileUrl: 'http://dm-store-aat.service.core-compute-aat.internal/documents/',
            mimeType: null,
            status: null
          }
        ]
      }
    };

    it('should render guidance and document links', () => {
      return custom(ProgressBar)
        .withSession(session)
        .get()
        .expect(httpStatus.OK)
        .html($ => {
          const rightHandSideMenu = $('.govuk-grid-column-one-third').html();
          expect(rightHandSideMenu).to.include('Guidance on GOV.UK')
            .and.to.include('Responding to a divorce application')
            .and.to.include('Decree nisi')
            .and.to.include('Decree absolute')
            .and.to.include('Download your documents')
            .and.to.include('Divorce application (PDF)')
            .and.to.include('Your answers (PDF)')
            .and.to.include('Co-Respondent’s answers (PDF)')
            .and.to.include('Certificate Of Entitlement (PDF)')
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

  describe('CCD state: DNDrafted', () => {
    const session = {
      caseState: 'DNDrafted'
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingDecreeNisi);
    });
  });

  describe('CCD state: AosAwaitingSol', () => {
    const session = {
      caseState: 'AosAwaitingSol',
      divorceWho: 'husband',
      originalPetition: {
        d8: []
      }
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.aosAwaitingSol);
    });

    it('renders the content', () => {
      return content(ProgressBar, session, {
        specificValues: [progressBarContent.en.aosAwaitingSol.heading]
      });
    });
  });

  describe('CCD state: DNPronounced', () => {
    const session = {
      caseState: 'DNPronounced'
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.awaitingDecreeAbsolute);
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
    const session = {
      caseState: 'AwaitingPronouncement'
    };

    it('renders the correct template', () => {
      const instance = stepAsInstance(ProgressBar, session);
      expect(instance.stateTemplate).to.eql(templates.defendedDivorce);
    });
  });
});
