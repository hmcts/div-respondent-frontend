const modulePath = 'steps/co-respondent/cr-progress-bar/CrProgressBar.step';
const CrProgressBar = require(modulePath);
const CrProgressBarContent = require('steps/co-respondent/cr-progress-bar/CrProgressBar.content');
const idam = require('services/idam');
const { custom, expect, middleware,
  sinon, content } = require('@hmcts/one-per-page-test-suite');
const feesAndPaymentsService = require('services/feesAndPaymentsService');
const httpStatus = require('http-status-codes');
const { buildSessionWithCourtsInfo,
  testDivorceUnitDetailsRender,
  testDivorceUnitWithStreetDetailsRender,
  testCTSCDetailsRender } = require('test/unit/helpers/courtInformation');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
    sinon.stub(feesAndPaymentsService, 'get').withArgs('defended-petition-fee')
      .resolves({
        feeCode: 'FEE0002',
        version: 4,
        amount: 245.00,
        description: 'Filing an application for a divorce, nullity or civil partnership dissolution – fees order 1.2.' // eslint-disable-line max-len
      });
  });

  afterEach(() => {
    idam.protect.restore();
    feesAndPaymentsService.get.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(CrProgressBar, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    const session = {
      originalPetition: {
        jurisdictionConnection: {}
      }
    };
    return content(
      CrProgressBar,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'defended-petition-fee');
    });
  });

  it('renders the content for Aos Received - not defending case', () => {
    const session = {
      caseState: 'AwaitingPronouncement',
      originalPetition: {
        coRespondentAnswers: {
          contactInfo: {
            emailAddress: 'user@email.com'
          },
          aos: {
            received: 'Yes',
            letterHolderId: '755791',
            dateReceived: '2019-02-22'
          },
          defendsDivorce: 'No'
        }
      }
    };
    return content(CrProgressBar, session, {
      specificValues: [
        CrProgressBarContent.en.notDefending.heading,
        CrProgressBarContent.en.notDefending.info
      ]
    });
  });

  it('renders the content for Aos Received - defending awaiting answer', () => {
    const session = {
      caseState: 'AwaitingPronouncement',
      originalPetition: {
        coRespondentAnswers: {
          contactInfo: {
            emailAddress: 'user@email.com'
          },
          aos: {
            received: 'Yes',
            letterHolderId: '755791',
            dateReceived: '2019-02-22'
          },
          defendsDivorce: 'Yes',
          answer: {
            received: 'No'
          }
        }
      }
    };
    return content(CrProgressBar, session, {
      specificValues: [
        CrProgressBarContent.en.defendingAwaitingAnswer.heading,
        CrProgressBarContent.en.defendingAwaitingAnswer.para1,
        CrProgressBarContent.en.defendingAwaitingAnswer.para2,
        CrProgressBarContent.en.defendingAwaitingAnswer.para3,
        CrProgressBarContent.en.defendingAwaitingAnswer.para5,
        CrProgressBarContent.en.defendingAwaitingAnswer.para6
      ]
    });
  });

  it('renders the content for Aos Received - defending submitted answer', () => {
    const session = {
      caseState: 'AwaitingPronouncement',
      originalPetition: {
        coRespondentAnswers: {
          contactInfo: {
            emailAddress: 'user@email.com'
          },
          aos: {
            received: 'Yes',
            letterHolderId: '755791',
            dateReceived: '2019-02-22'
          },
          defendsDivorce: 'Yes',
          answer: {
            received: 'Yes'
          }
        }
      }
    };
    return content(CrProgressBar, session, {
      specificValues: [
        CrProgressBarContent.en.defendingSubmittedAnswer.heading,
        CrProgressBarContent.en.defendingSubmittedAnswer.para1,
        CrProgressBarContent.en.defendingSubmittedAnswer.para2,
        CrProgressBarContent.en.defendingSubmittedAnswer.para3
      ]
    });
  });

  it('renders the content for Aos not received - Too late to respond', () => {
    const session = {
      caseState: 'DivorceGranted',
      originalPetition: {
        coRespondentAnswers: {
          contactInfo: {
            emailAddress: 'user@email.com'
          }
        }
      }
    };
    return content(CrProgressBar, session, {
      specificValues: [
        CrProgressBarContent.en.tooLateToRespond.heading,
        CrProgressBarContent.en.tooLateToRespond.info
      ]
    });
  });

  describe('content for awaiting pronouncement and hearing date', () => { // eslint-disable-line max-len
    const session = {
      caseState: 'AwaitingPronouncement',
      originalPetition: {
        coRespondentAnswers: {
          contactInfo: {
            emailAddress: 'user@email.com'
          },
          aos: {
            received: 'Yes',
            letterHolderId: '755791',
            dateReceived: '2019-02-22'
          },
          defendsDivorce: 'Yes',
          answer: {
            received: 'Yes'
          }
        },
        hearingDate: ['3000-01-01T00:00:00.000+0000'],
        d8: [
          {
            id: '88217833-f74f-4cc3-ae73-882178332ccd',
            fileName: 'd8petition1539017559370699.pdf'
          }
        ]
      }
    };

    it('shows costs content', () => {
      session.originalPetition.costsClaimGranted = 'Yes';
      session.originalPetition.whoPaysCosts = 'respondentAndCoRespondent';
      return content(CrProgressBar, session, {
        specificContent: [
          'awaitingPronouncementHearingDate.title',
          'awaitingPronouncementHearingDate.districtJudge',
          'awaitingPronouncementHearingDate.orderPayDivorceCosts',
          'awaitingPronouncementHearingDate.divorceOnlyComplete',
          'awaitingPronouncementHearingDate.theHearing',
          'awaitingPronouncementHearingDate.findMoreDetails',
          'awaitingPronouncementHearingDate.wantToObject',
          'awaitingPronouncementHearingDate.attendTheHearing',
          'awaitingPronouncementHearingDate.attendTheHearingCosts'
        ]
      });
    });

    it('doesnt show costs content', () => {
      session.originalPetition.costsClaimGranted = 'No';
      return content(CrProgressBar, session, {
        specificContentToNotExist: [
          'awaitingPronouncementHearingDate.orderPayDivorceCosts',
          'awaitingPronouncementHearingDate.wantToObject'
        ]
      });
    });
  });

  it('renders the content for awaiting Pronouncement and Hearing Data in the Future - Too late to respond', () => { // eslint-disable-line max-len
    const session = {
      caseState: 'DivorceGranted',
      originalPetition: {
        coRespondentAnswers: {
          contactInfo: {
            emailAddress: 'user@email.com'
          }
        }
      }
    };
    return content(CrProgressBar, session, {
      specificValues: [
        CrProgressBarContent.en.tooLateToRespond.heading,
        CrProgressBarContent.en.tooLateToRespond.info
      ]
    });
  });


  describe('court address details', () => {
    const basicSession = {
      caseState: 'AosAwaiting',
      originalPetition: {
        coRespondentAnswers: {
          contactInfo: {
            emailAddress: 'user@email.com'
          },
          aos: {
            received: 'Yes',
            letterHolderId: '755791',
            dateReceived: '2019-02-22'
          },
          defendsDivorce: 'Yes',
          answer: {
            received: 'Yes'
          }
        },
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

    describe('when divorce unit handles case', () => {
      const session = Object.assign({}, basicSession,
        buildSessionWithCourtsInfo('westMidlands'));

      it('should render the divorce unit info', () => {
        return custom(CrProgressBar)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.column-one-third').html();

            expect(rightHandSideMenu).to.include('Your divorce centre');
            testDivorceUnitDetailsRender(rightHandSideMenu);
          });
      });
    });

    describe('when service centre handles case', () => {
      const session = Object.assign({}, basicSession,
        buildSessionWithCourtsInfo('serviceCentre'));

      it('some contents should exist', () => {
        return custom(CrProgressBar)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.column-one-third').html();

            testCTSCDetailsRender(rightHandSideMenu);
          });
      });
    });

    describe('when divorce centre handles case', () => {
      const session = Object.assign({}, basicSession,
        buildSessionWithCourtsInfo('northWest'));

      it('some contents should exist', () => {
        return custom(CrProgressBar)
          .withSession(session)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.column-one-third').html();
            testDivorceUnitWithStreetDetailsRender(rightHandSideMenu);
          });
      });
    });

    describe('right hand side menu rendering', () => {
      it('should render guidance links', () => {
        return custom(CrProgressBar)
          .withSession(basicSession)
          .get()
          .expect(httpStatus.OK)
          .html($ => {
            const rightHandSideMenu = $('.column-one-third').html();
            expect(rightHandSideMenu).to.include('Guidance on GOV.UK')
              .and.to.include('How to respond to a divorce application')
              .and.to.include('Get a divorce')
              .and.to.include('Download your documents')
              .and.to.include('Divorce application (PDF)')
              .and.to.include('Your answers (PDF)')
              .and.to.include('Certificate Of Entitlement (PDF)')
              .and.to.include('Children and divorce')
              .and.to.include('Money and property');
          });
      });
    });
  });
});