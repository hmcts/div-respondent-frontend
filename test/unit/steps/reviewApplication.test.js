/* eslint max-lines: 0 */

const modulePath = 'steps/review-application/ReviewApplication.step';

const ReviewApplication = require(modulePath);
const End = require('steps/end/End.step.js');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');
const ccd = require('middleware/ccd');
const CONF = require('config');

describe(modulePath, () => {
  const defaultEnvironment = CONF.environment;
  beforeEach(() => {
    CONF.environment = 'development';
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
    sinon.stub(ccd, 'getUserData').callsFake(middleware.nextMock);
  });

  afterEach(() => {
    CONF.environment = defaultEnvironment;
    idam.protect.restore();
    ccd.getUserData.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ReviewApplication, [ idam.protect() ]);
  });

  it('shows error if statement of truth not answered', () => {
    const session = {
      originalPetition: {
        connections: {}
      }
    };
    return question.testErrors(ReviewApplication, session);
  });

  it('redirects to End statement of truth answered', () => {
    const fields = { statementOfTruth: 'yes' };
    return question.redirectWithField(ReviewApplication, fields, End);
  });

  describe('values', () => {
    it('displays petitioner and respondent names', () => {
      const session = {
        originalPetition: {
          connections: {},
          petitionerFirstName: 'petitioner first name',
          petitionerLastName: 'petitioner last name',
          respondentFirstName: 'respondent first lastname',
          respondentLastName: 'respondent last name'
        }
      };
      return content(
        ReviewApplication,
        session,
        {
          specificValues: [
            session.originalPetition.petitionerFirstName,
            session.originalPetition.petitionerLastName,
            session.originalPetition.respondentFirstName,
            session.originalPetition.respondentLastName
          ]
        }
      );
    });

    it('displays coorespondent names', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryIsNamed: 'Yes',
          reasonForDivorceAdultery3rdPartyFirstName: 'corespondent firstname',
          reasonForDivorceAdultery3rdPartyLastName: 'corespondent lastname'
        }
      };
      return content(
        ReviewApplication,
        session,
        {
          specificValues: [
            session.originalPetition.reasonForDivorceAdultery3rdPartyFirstName,
            session.originalPetition.reasonForDivorceAdultery3rdPartyLastName
          ]
        }
      );
    });

    it('displays marriage date formatted', () => {
      const session = {
        originalPetition: {
          connections: {},
          marriageDate: '2001-02-02T00:00:00.000Z'
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificValues: [ '02 February 2001' ] }
      );
    });

    it('displays legal proceedings details', () => {
      const session = {
        originalPetition: {
          connections: {},
          legalProceedings: 'Yes',
          legalProceedingsDetails: 'The legal proceeding details'
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificValues: [ session.originalPetition.legalProceedingsDetails ] }
      );
    });

    it('displays reason for divorce adultery details', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryKnowWhere: 'Yes',
          reasonForDivorceAdulteryKnowWhen: 'Yes',
          reasonForDivorceAdulteryDetails: 'Here are some adultery details',
          reasonForDivorceAdulteryWhereDetails: 'Where the adultery happened',
          reasonForDivorceAdulteryWhenDetails: 'When the adultery happened'
        }
      };
      return content(
        ReviewApplication,
        session,
        {
          specificValues: [
            session.originalPetition.reasonForDivorceAdulteryDetails,
            session.originalPetition.reasonForDivorceAdulteryWhereDetails,
            session.originalPetition.reasonForDivorceAdulteryWhenDetails
          ]
        }
      );
    });

    it('displays reason for divorce unreasonable behaviour details', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'unreasonable-behaviour',
          reasonForDivorceBehaviourDetails: [ 'My wife is lazy' ]
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificValues: [ session.originalPetition.reasonForDivorceBehaviourDetails ] }
      );
    });

    it('displays reason for divorce desertion details', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'desertion',
          reasonForDivorceDesertionDetails: 'I was deserted'
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificValues: [ session.originalPetition.reasonForDivorceDesertionDetails ] }
      );
    });
  });

  describe('content', () => {
    it('all', () => {
      const session = {
        originalPetition: {
          connections: {}
        }
      };
      const ignoreContent = [
        'coRespondentsCorrespondenceAddress',
        'coRespondent',
        'reasonForDivorceAdulteryCorrespondentNamed',
        'reasonForDivorceAdulteryCorrespondentNotNamed',
        'reasonForDivorceAdulteryWhere',
        'reasonForDivorceAdulteryWhen',
        'reasonForDivorceUnreasonableBehaviourBrokenDown',
        'reasonForDivorceUnreasonableBehaviourStatment',
        'reasonForDivorceUnreasonableBehaviourDescription',
        'reasonForDivorceSeperationTwoYears',
        'reasonForDivorceSeperationTwoYearsBrokendDown',
        'reasonForDivorceSeperationFiveYears',
        'reasonForDivorceSeperationFiveYearsBrokendDown',
        'reasonForDivorceDesertion',
        'reasonForDivorceDesertionBrokendDown',
        'reasonForDivorceDesertionStatment',
        'claimingCostsFromRespondentCoRespondent',
        'claimingCostsFromCoRespondent',
        'claimingCostsFromRespondent',
        'financialOrdersPropertyMoneyPensionsChildren',
        'financialOrdersChildren',
        'financialOrdersPropertyMoneyPensions',
        'applicantsCorrespondenceAddress',
        'costsPetitionerPayedByRespondentAndCorrispondent',
        'costsPetitionerPayedByCorrespondent',
        'costsPetitionerPayedByRespondent',
        'costsPetitionerDivorceCostsdByRespondentAndCorespondent',
        'costsPetitionerDivorceCostsdByCorespondent',
        'costsPetitionerDivorceCostsdByRespondent',
        'costsPetitionerDivorceCostsdByFinantialOrder',
        'jurisdictionConnectionBothResident',
        'jurisdictionConnectionBothDomiciled',
        'jurisdictionConnectionOneResides',
        'jurisdictionConnectionPetitioner',
        'jurisdictionConnectionRespondent',
        'jurisdictionConnectionPetitionerSixMonths',
        'jurisdictionConnectionOther',
        'onGoingCasesNo',
        'petitionerCorrespondenceAddressHeading',
        'whereTheMarriage'
      ];
      return content(ReviewApplication, session, { ignoreContent });
    });

    context('intro text - claim costs & finantial order', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrder: 'Yes',
            financialOrderFor: [],
            claimsCostsFrom: ['respondent', 'correspondent']
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: ['costsPetitionerPayedByRespondentAndCorrispondent'] }
        );
      });
      it('from co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrder: 'Yes',
            financialOrderFor: [],
            claimsCostsFrom: ['correspondent']
          }
        };
        return content(ReviewApplication, session, {
          specificContent: ['costsPetitionerPayedByCorrispondent']
        });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrder: 'Yes',
            financialOrderFor: [],
            claimsCostsFrom: []
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'costsPetitionerPayedByRespondent' ] });
      });
    });

    context('claim costs only', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrder: 'No',
            claimsCostsFrom: ['respondent', 'correspondent']
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'costsPetitionerDivorceCostsdByRespondentAndCorespondent'] }
        );
      });
      it('from co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrder: 'No',
            claimsCostsFrom: ['correspondent']
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'costsPetitionerDivorceCostsdByCorespondent' ] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            financialOrder: 'No',
            claimsCostsFrom: []
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'costsPetitionerDivorceCostsdByRespondent' ] });
      });
    });

    it('financialOrderFor only', () => {
      const session = {
        originalPetition: {
          connections: {},
          claimsCosts: 'No',
          financialOrder: 'Yes',
          financialOrderFor: 'petitioner',
          claimsCostsFrom: []
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificContent: [ 'costsPetitionerDivorceCostsdByFinantialOrder' ] });
    });

    it('not claiming costs or applying for financial Order', () => {
      const session = {
        originalPetition: {
          connections: {},
          claimsCosts: 'No',
          financialOrder: 'No',
          claimsCostsFrom: []
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificContent: [ 'costsPetitionerDivorceNoCosts' ] });
    });

    it('shows details for co-respondent', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryIsNamed: 'Yes',
          reasonForDivorceAdultery3rdPartyFirstName: 'first name',
          reasonForDivorceAdultery3rdPartyLastName: 'last name'
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificContent: [ 'coRespondent' ] });
    });

    it('shows name for co-respondent', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryIsNamed: 'Yes',
          reasonForDivorceAdultery3rdPartyFirstName: 'first name',
          reasonForDivorceAdultery3rdPartyLastName: 'last name'
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificContent: [ 'coRespondent' ] });
    });

    context('jurisdiction', () => {
      it('for both resident', () => {
        const session = {
          originalPetition: {
            connections: { A: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'jurisdictionConnectionBothResident' ] });
      });
      it('for one resides', () => {
        const session = {
          originalPetition: {
            connections: { B: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'jurisdictionConnectionOneResides' ] });
      });
      it('respondent', () => {
        const session = {
          originalPetition: {
            connections: { C: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'jurisdictionConnectionRespondent' ] });
      });
      it('petitioner', () => {
        const session = {
          originalPetition: {
            connections: { D: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'jurisdictionConnectionPetitioner' ] });
      });
      it('petitioner six months', () => {
        const session = {
          originalPetition: {
            connections: { E: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'jurisdictionConnectionPetitionerSixMonths' ] });
      });
      it('both domiciled', () => {
        const session = {
          originalPetition: {
            connections: { F: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'jurisdictionConnectionBothDomiciled' ] });
      });
      it('both domiciled', () => {
        const session = {
          originalPetition: {
            connections: { G: '' },
            reasonForDivorce: 'adultery'
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'jurisdictionConnectionOther' ] });
      });
    });

    context('legal proceedings', () => {
      it('no', () => {
        const session = {
          originalPetition: {
            connections: {},
            legalProceedings: 'No'
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'onGoingCasesNo' ] });
      });
      it('Yes', () => {
        const session = {
          originalPetition: {
            connections: {},
            legalProceedings: 'Yes'
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'onGoingCasesYes' ] });
      });
    });

    context('reasons for divorce', () => {
      context('adultery', () => {
        it('base content', () => {
          const session = {
            originalPetition: {
              connections: {},
              reasonForDivorce: 'adultery'
            }
          };
          return content(
            ReviewApplication,
            session,
            { specificContent: [ 'reasonForDivorceAdultery' ] });
        });
        it('co-respondent is named', () => {
          const session = {
            originalPetition: {
              connections: {},
              reasonForDivorce: 'adultery',
              reasonForDivorceAdulteryIsNamed: 'Yes'
            }
          };
          return content(
            ReviewApplication,
            session,
            { specificContent: [ 'reasonForDivorceAdultery' ] });
        });
        it('knows where', () => {
          const session = {
            originalPetition: {
              connections: {},
              reasonForDivorce: 'adultery',
              reasonForDivorceAdulteryKnowWhere: 'Yes'
            }
          };
          return content(
            ReviewApplication,
            session,
            { specificContent: [ 'reasonForDivorceAdulteryWhere' ] });
        });
        it('knows when', () => {
          const session = {
            originalPetition: {
              connections: {},
              reasonForDivorce: 'adultery',
              reasonForDivorceAdulteryKnowWhen: 'Yes'
            }
          };
          return content(
            ReviewApplication,
            session,
            { specificContent: [ 'reasonForDivorceAdulteryWhen' ] });
        });
      });

      it('unreasonable behaviour', () => {
        const session = {
          originalPetition: {
            connections: {},
            reasonForDivorce: 'unreasonable-behaviour'
          }
        };
        const specificContent = [
          'reasonForDivorceUnreasonableBehaviourBrokenDown',
          'reasonForDivorceUnreasonableBehaviourStatment',
          'reasonForDivorceUnreasonableBehaviourDescription',
          'reasonForDivorceBehaviourDetails'
        ];
        return content(ReviewApplication, session, { specificContent });
      });

      it('separation 2 years', () => {
        const session = {
          originalPetition: {
            connections: {},
            reasonForDivorce: 'separation-2-years'
          }
        };
        const specificContent = [
          'reasonForDivorceSeperationTwoYearsBrokendDown',
          'reasonForDivorceSeperationTwoYears'
        ];
        return content(ReviewApplication, session, { specificContent });
      });

      it('separation 5 years', () => {
        const session = {
          originalPetition: {
            connections: {},
            reasonForDivorce: 'separation-5-years'
          }
        };
        const specificContent = [
          'reasonForDivorceSeperationFiveYearsBrokendDown',
          'reasonForDivorceSeperationFiveYears'
        ];
        return content(ReviewApplication, session, { specificContent });
      });

      it('desertion', () => {
        const session = {
          originalPetition: {
            connections: {},
            reasonForDivorce: 'desertion'
          }
        };
        const specificContent = [
          'reasonForDivorceDesertionBrokendDown',
          'reasonForDivorceDesertion',
          'reasonForDivorceDesertionStatment'
        ];
        return content(ReviewApplication, session, { specificContent });
      });
    });

    context('cost orders', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            claimsCostsFrom: ['respondent', 'correspondent']
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'claimingCostsFromRespondentCoRespondent' ] });
      });
      it('from co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            claimsCostsFrom: ['correspondent']
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'claimingCostsFromCoRespondent' ] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'Yes',
            claimsCostsFrom: []
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'claimingCostsFromRespondent' ] });
      });

      it('not claiming', () => {
        const session = {
          originalPetition: {
            connections: {},
            claimsCosts: 'No',
            claimsCostsFrom: []
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'notClaimingForDivorce' ] });
      });
    });

    context('finantial orders', () => {
      it('for children and petitioner', () => {
        const session = {
          originalPetition: {
            connections: {},
            financialOrder: 'Yes',
            financialOrderFor: ['children', 'petitioner']
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'financialOrdersPropertyMoneyPensionsChildren' ] }
        );
      });
      it('for children', () => {
        const session = {
          originalPetition: {
            connections: {},
            financialOrder: 'Yes',
            financialOrderFor: ['children']
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'financialOrdersChildren' ] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          originalPetition: {
            connections: {},
            financialOrder: 'Yes',
            financialOrderFor: []
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'financialOrdersPropertyMoneyPensions' ] });
      });

      it('not claiming', () => {
        const session = {
          originalPetition: {
            connections: {},
            financialOrder: 'No',
            claimsCostsFrom: []
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'financialOrdersNone' ] });
      });
    });

    it('Petitioner Address if not confidential', () => {
      const session = {
        originalPetition: {
          connections: {},
          petitionerContactDetailsConfidential: 'share'
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificContent: [ 'applicantsCorrespondenceAddress' ] });
    });


    it('CoRespondent Address', () => {
      const session = {
        originalPetition: {
          connections: {},
          reasonForDivorceAdultery3rdAddress: ['line1', 'line2', 'postcode']
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificContent: [ 'coRespondentsCorrespondenceAddress' ] });
    });
  });
});
