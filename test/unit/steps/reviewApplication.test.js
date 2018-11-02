/* eslint max-lines: 0 */

const modulePath = 'steps/review-application/ReviewApplication.step';

const ReviewApplication = require(modulePath);
const ChooseAResponse = require('steps/choose-a-response/ChooseAResponse.step');
const idam = require('services/idam');
const { middleware, question, sinon, content } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect').returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  it('has idam.protect middleware', () => {
    return middleware.hasMiddleware(ReviewApplication, [ idam.protect() ]);
  });

  it('shows error if statement of truth not answered', () => {
    const session = {
      originalPetition: {
        jurisdictionConnection: {}
      }
    };
    return question.testErrors(ReviewApplication, session);
  });

  it('redirects to choose a response page when answered', () => {
    const fields = { respConfirmReadPetition: 'Yes' };
    const session = {
      originalPetition: {
        reasonForDivorceClaimingAdultery: false
      }
    };
    return question.redirectWithField(ReviewApplication, fields, ChooseAResponse, session);
  });

  describe('values', () => {
    it('displays case reference number', () => {
      const session = {
        originalPetition: {
          caseReference: 'some-ref-number',
          jurisdictionConnection: {}
        }
      };
      return content(
        ReviewApplication,
        session,
        {
          specificValues: [ session.caseReference ]
        }
      );
    });

    it('displays issue date', () => {
      const session = {
        originalPetition: {
          issueDate: '2006-02-02T00:00:00.000+0000',
          jurisdictionConnection: {}
        }
      };
      return content(
        ReviewApplication,
        session,
        {
          specificValues: [ '02 February 2006' ]
        }
      );
    });

    it('displays petitioner and respondent names', () => {
      const session = {
        originalPetition: {
          jurisdictionConnection: {},
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
          jurisdictionConnection: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryWishToName: 'Yes',
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
          jurisdictionConnection: {},
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
          jurisdictionConnection: {},
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
          jurisdictionConnection: {},
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
          jurisdictionConnection: {},
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
          jurisdictionConnection: {},
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
          jurisdictionConnection: {}
        }
      };
      const ignoreContent = [
        'coRespondentsCorrespondenceAddress',
        'coRespondent',
        'reasonForDivorceAdulteryCorrespondentNamed',
        'reasonForDivorceAdulteryCorrespondentNotNamed',
        'reasonForDivorceAdulteryStatement',
        'reasonForDivorceAdulteryWhere',
        'reasonForDivorceAdulteryWhen',
        'reasonForDivorceUnreasonableBehaviourBrokenDown',
        'reasonForDivorceUnreasonableBehaviourStatement',
        'reasonForDivorceSeparationTwoYears',
        'reasonForDivorceSeparationTwoYearsBrokenDown',
        'reasonForDivorceSeparationFiveYears',
        'reasonForDivorceSeparationFiveYearsBrokenDown',
        'reasonForDivorceDesertion',
        'reasonForDivorceDesertionBrokenDown',
        'reasonForDivorceDesertionStatement',
        'claimingCostsFromRespondentCoRespondent',
        'claimingCostsFromCoRespondent',
        'claimingCostsFromRespondent',
        'financialOrdersPropertyMoneyPensionsChildren',
        'financialOrdersChildren',
        'financialOrdersPropertyMoneyPensions',
        'applicantsCorrespondenceAddress',
        'costsPetitionerPayedByRespondentAndCorrespondent',
        'costsPetitionerPayedByCorrespondent',
        'costsPetitionerPayedByRespondent',
        'costsPetitionerDivorceCostsByRespondentAndCorespondent',
        'costsPetitionerDivorceCostsByCorespondent',
        'costsPetitionerDivorceCostsByRespondent',
        'costsPetitionerDivorceCostsByFinancialOrder',
        'jurisdictionConnectionBothResident',
        'jurisdictionConnectionBothDomiciled',
        'jurisdictionConnectionOneResides',
        'jurisdictionConnectionPetitioner',
        'jurisdictionConnectionRespondent',
        'jurisdictionConnectionPetitionerSixMonths',
        'jurisdictionConnectionOther',
        'onGoingCasesNo',
        'petitionerCorrespondenceAddressHeading',
        'whereTheMarriage',
        'readConfirmationQuestion',
        'readConfirmationYes',
        'readConfirmationNo'
      ];
      return content(ReviewApplication, session, { ignoreContent });
    });

    context('intro text - claim costs & finantial order', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          originalPetition: {
            jurisdictionConnection: {},
            claimsCosts: 'Yes',
            financialOrder: 'Yes',
            financialOrderFor: [],
            claimsCostsFrom: ['respondent', 'correspondent']
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: ['costsPetitionerPayedByRespondentAndCorrespondent'] }
        );
      });
      it('from co-respondent', () => {
        const session = {
          originalPetition: {
            jurisdictionConnection: {},
            claimsCosts: 'Yes',
            financialOrder: 'Yes',
            financialOrderFor: [],
            claimsCostsFrom: ['correspondent']
          }
        };
        return content(ReviewApplication, session, {
          specificContent: ['costsPetitionerPayedByCorrespondent']
        });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          originalPetition: {
            jurisdictionConnection: {},
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
            jurisdictionConnection: {},
            claimsCosts: 'Yes',
            financialOrder: 'No',
            claimsCostsFrom: ['respondent', 'correspondent']
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'costsPetitionerDivorceCostsByRespondentAndCorespondent'] }
        );
      });
      it('from co-respondent', () => {
        const session = {
          originalPetition: {
            jurisdictionConnection: {},
            claimsCosts: 'Yes',
            financialOrder: 'No',
            claimsCostsFrom: ['correspondent']
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'costsPetitionerDivorceCostsByCorespondent' ] });
      });

      it('from neither respondent or co-respondent', () => {
        const session = {
          originalPetition: {
            jurisdictionConnection: {},
            claimsCosts: 'Yes',
            financialOrder: 'No',
            claimsCostsFrom: []
          }
        };
        return content(
          ReviewApplication,
          session,
          { specificContent: [ 'costsPetitionerDivorceCostsByRespondent' ] });
      });
    });

    it('financialOrderFor only', () => {
      const session = {
        originalPetition: {
          jurisdictionConnection: {},
          claimsCosts: 'No',
          financialOrder: 'Yes',
          financialOrderFor: 'petitioner',
          claimsCostsFrom: []
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificContent: [ 'costsPetitionerDivorceCostsByFinancialOrder' ] });
    });

    it('not claiming costs or applying for financial Order', () => {
      const session = {
        originalPetition: {
          jurisdictionConnection: {},
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
          jurisdictionConnection: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryWishToName: 'Yes',
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
          jurisdictionConnection: {},
          reasonForDivorce: 'adultery',
          reasonForDivorceAdulteryWishToName: 'Yes',
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
            jurisdictionConnection: { A: '' },
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
            jurisdictionConnection: { B: '' },
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
            jurisdictionConnection: { C: '' },
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
            jurisdictionConnection: { D: '' },
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
            jurisdictionConnection: { E: '' },
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
            jurisdictionConnection: { F: '' },
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
            jurisdictionConnection: { G: '' },
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
      it('No', () => {
        const session = {
          originalPetition: {
            jurisdictionConnection: {},
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
            jurisdictionConnection: {},
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
        it('co-respondent is named', () => {
          const session = {
            originalPetition: {
              jurisdictionConnection: {},
              reasonForDivorce: 'adultery',
              reasonForDivorceAdulteryWishToName: 'Yes'
            }
          };
          return content(
            ReviewApplication,
            session,
            { specificContent: [ 'reasonForDivorceAdulteryCorrespondentNamed' ] });
        });
        it('knows where', () => {
          const session = {
            originalPetition: {
              jurisdictionConnection: {},
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
              jurisdictionConnection: {},
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
            jurisdictionConnection: {},
            reasonForDivorce: 'unreasonable-behaviour'
          }
        };
        const specificContent = [
          'reasonForDivorceUnreasonableBehaviourBrokenDown',
          'reasonForDivorceUnreasonableBehaviourStatement'
        ];
        return content(ReviewApplication, session, { specificContent });
      });

      it('separation 2 years', () => {
        const session = {
          originalPetition: {
            jurisdictionConnection: {},
            reasonForDivorce: 'separation-2-years'
          }
        };
        const specificContent = [
          'reasonForDivorceSeparationTwoYearsBrokenDown',
          'reasonForDivorceSeparationTwoYears'
        ];
        return content(ReviewApplication, session, { specificContent });
      });

      it('separation 5 years', () => {
        const session = {
          originalPetition: {
            jurisdictionConnection: {},
            reasonForDivorce: 'separation-5-years'
          }
        };
        const specificContent = [
          'reasonForDivorceSeparationFiveYearsBrokenDown',
          'reasonForDivorceSeparationFiveYears'
        ];
        return content(ReviewApplication, session, { specificContent });
      });

      it('desertion', () => {
        const session = {
          originalPetition: {
            jurisdictionConnection: {},
            reasonForDivorce: 'desertion'
          }
        };
        const specificContent = [
          'reasonForDivorceDesertionBrokenDown',
          'reasonForDivorceDesertion',
          'reasonForDivorceDesertionStatement'
        ];
        return content(ReviewApplication, session, { specificContent });
      });
    });

    context('cost orders', () => {
      it('from respondent and co-respondent', () => {
        const session = {
          originalPetition: {
            jurisdictionConnection: {},
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
            jurisdictionConnection: {},
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
            jurisdictionConnection: {},
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
            jurisdictionConnection: {},
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
            jurisdictionConnection: {},
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
            jurisdictionConnection: {},
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
            jurisdictionConnection: {},
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
            jurisdictionConnection: {},
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
          jurisdictionConnection: {},
          petitionerContactDetailsConfidential: 'share',
          petitionerCorrespondenceAddress: {
            address: '129 king road'
          }
        }
      };
      return content(
        ReviewApplication,
        session,
        { specificValues: [ session.originalPetition.petitionerCorrespondenceAddress.address] });
    });


    it('CoRespondent Address', () => {
      const session = {
        originalPetition: {
          jurisdictionConnection: {},
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
