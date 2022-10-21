const modulePath = 'steps/respondent/choose-a-response/ChooseAResponse.step';
const stepContent = require('steps/respondent/choose-a-response/ChooseAResponse.content');
const ChooseAResponse = require(modulePath);
const Jurisdiction = require('steps/respondent/jurisdiction/Jurisdiction.step');
const ConfirmDefence = require('steps/respondent/confirm-defence/ConfirmDefence.step');
const FinancialSituation = require('steps/respondent/financial-situation/FinancialSituation.step');

const idam = require('services/idam');
const { middleware, question, sinon, content, expect } = require('@hmcts/one-per-page-test-suite');
const feesAndPaymentsService = require('services/feesAndPaymentsService');

describe(modulePath, () => {
  let session = {};

  beforeEach(() => {
    session = { fields: { response: { value: 'proceed' } } };
    session.originalPetition = { reasonForDivorce: 'adultery' };
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
    return middleware.hasMiddleware(ChooseAResponse, [idam.protect()]);
  });

  it('has getFeeFromFeesAndPayments middleware called with the proper values, and the corresponding number of times', () => { // eslint-disable-line max-len
    return content(
      ChooseAResponse,
      session,
      { specificContent: ['title'] }
    ).then(() => {
      sinon.assert.calledOnce(feesAndPaymentsService.get);
      sinon.assert.calledWith(feesAndPaymentsService.get, 'defended-petition-fee');
    });
  });

  it('redirects to jurisdiction page when proceeding with divorce', () => {
    const fields = { response: 'proceed' };
    return question.redirectWithField(ChooseAResponse, fields, Jurisdiction, session);
  });

  it('redirects to confirm defence page when disagreeing with divorce', () => {
    const fields = { response: 'defend' };
    return question.redirectWithField(ChooseAResponse, fields, ConfirmDefence, session);
  });

  it('redirects to financial situation when 5 year separation and not defended', () => {
    const fields = { response: 'proceed' };
    session.originalPetition = { reasonForDivorce: 'separation-5-years' };
    return question.redirectWithField(ChooseAResponse, fields, FinancialSituation, session);
  });

  it('redirects to defend are you sure page when disagreeing with divorce and reason is 5 year separatinon', () => { // eslint-disable-line max-len
    const fields = { response: 'defend' };
    session.originalPetition.reasonForDivorce = 'separation-5-years';
    return question.redirectWithField(ChooseAResponse, fields, ConfirmDefence, session);
  });

  it('shows error if question is not answered', () => {
    return question.testErrors(ChooseAResponse, session);
  });

  it('renders the content', () => {
    const ignoreContent = [
      'info',
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'signIn',
      'signOut',
      'languageToggle',
      'thereWasAProblem',
      'change',
      'husband',
      'wife',
      'phoneToCallIfProblems'
    ];

    return content(ChooseAResponse, session, { ignoreContent });
  });

  it('does not render specific behaviour info by default', () => {
    const ignoreContent = [
      'info',
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'signIn',
      'signOut',
      'languageToggle',
      'thereWasAProblem',
      'change',
      'husband',
      'wife',
      'phoneToCallIfProblems'
    ];

    return content(ChooseAResponse, session, {
      ignoreContent,
      specificValuesToNotExist: [
        stepContent.en.info.options.proceedButDisagree.heading,
        stepContent.en.info.options.proceedButDisagree.summary
      ]
    });
  });

  it('does not render specific behaviour questions by default', () => {
    const ignoreContent = [
      'info',
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'signIn',
      'signOut',
      'languageToggle',
      'thereWasAProblem',
      'change',
      'husband',
      'wife',
      'phoneToCallIfProblems'
    ];

    return content(ChooseAResponse, session, {
      ignoreContent,
      specificValuesToNotExist: [
        stepContent.en.fields.proceedButDisagree.heading,
        stepContent.en.fields.proceedButDisagree.summary
      ]
    });
  });

  it('does not render specific five year info by default', () => {
    const ignoreContent = [
      'info',
      'webChatTitle',
      'chatDown',
      'chatWithAnAgent',
      'noAgentsAvailable',
      'allAgentsBusy',
      'chatClosed',
      'chatAlreadyOpen',
      'chatOpeningHours',
      'signIn',
      'signOut',
      'languageToggle',
      'thereWasAProblem',
      'change',
      'husband',
      'wife',
      'phoneToCallIfProblems'
    ];

    return content(ChooseAResponse, session, {
      ignoreContent,
      specificValuesToNotExist: [
        stepContent.en.info.options.hardship.heading,
        stepContent.en.info.options.hardship.text1,
        stepContent.en.info.options.hardship.text2,
        stepContent.en.info.options.hardship.text3,
        stepContent.en.info.options.hardship.text4,
        stepContent.en.info.options.hardship.text5,
        stepContent.en.info.options.hardship.text6,
        stepContent.en.info.options.hardship.text7
      ]
    });
  });

  it('sets respWillDefendDivorce to no if response is proceed', () => {
    // given
    session.ChooseAResponse = {
      response: 'proceed'
    };

    // when
    const step = new ChooseAResponse({ session });
    step.retrieve()
      .validate();

    // then
    const values = step.values();
    expect(values).to.be.an('object');
    expect(values).to.have.property('respWillDefendDivorce', 'No');
  });

  it('sets respWillDefendDivorce to yes if response is defend', () => {
    // given
    session.ChooseAResponse = {
      response: 'defend'
    };

    // when
    const step = new ChooseAResponse({ session });
    step.retrieve()
      .validate();

    // then
    const values = step.values();
    expect(values).to.be.an('object');
    expect(values).to.have.property('respWillDefendDivorce', 'Yes');
  });

  describe('returns correct answer based on response', () => {
    it('returns correct answer for proceed', () => {
      // given
      session.ChooseAResponse = {
        response: 'proceed'
      };

      // when
      const step = new ChooseAResponse({ session });
      step.retrieve().validate();

      // then
      const values = step.answers();
      expect(values).to.be.an('object');
      expect(values).to.have.property('answer', stepContent.en.fields.proceed.answer);
    });

    it('returns correct answer for proceedButDisagree', () => {
      // given
      session.ChooseAResponse = {
        response: 'proceedButDisagree'
      };

      // when
      const step = new ChooseAResponse({ session });
      step.retrieve().validate();

      // then
      const values = step.answers();
      expect(values).to.be.an('object');
      expect(values).to.have.property('answer', stepContent.en.fields.proceedButDisagree.answer);
    });

    it('returns correct answer for defend', () => {
      // given
      session.ChooseAResponse = {
        response: 'defend'
      };

      // when
      const step = new ChooseAResponse({ session });
      step.retrieve().validate();

      // then
      const answers = step.answers();
      expect(answers).to.be.an('object');
      expect(answers).to.have.property('answer', stepContent.en.fields.defend.answer);
    });
  });

  ['desertion', 'unreasonable-behaviour'].forEach(reasonForDivorce => {
    describe(`when reason for divorce is ${reasonForDivorce}`, () => {
      beforeEach(() => {
        session.originalPetition = {
          reasonForDivorce
        };
      });

      it('redirects to jurisdiction page when proceed but do not admit with divorce', () => {
        const fields = { response: 'proceedButDisagree' };
        return question.redirectWithField(ChooseAResponse, fields, Jurisdiction, session);
      });

      it(`renders specific ${reasonForDivorce} info`, () => {
        session.ChooseAResponse = {
          response: 'proceedButDisagree'
        };

        return content(
          ChooseAResponse,
          session,
          {
            specificValues: [stepContent.en.info.options.proceedButDisagree.heading]
          }
        );
      });

      it(`renders specific  ${reasonForDivorce} questions`, () => {
        return content(
          ChooseAResponse,
          {
            divorceWho: 'wife',
            originalPetition: {
              reasonForDivorce
            }
          }, {
            specificValues: [
              stepContent.en.fields.proceed.heading,
              'I will let the divorce proceed, but I don’t accept what my wife said about me',
              stepContent.en.fields.defend.heading
            ]
          });
      });

      it('sets respWillDefendDivorce to no if response is proceed', () => {
        // given
        session.ChooseAResponse = {
          response: 'proceed'
        };

        // when
        const step = new ChooseAResponse({ session });
        step.retrieve()
          .validate();

        // then
        const values = step.values();
        expect(values).to.be.an('object');
        expect(values).to.have.property('respWillDefendDivorce', 'No');
      });

      it('sets respWillDefendDivorce to notAccept if response is proceedButDisagree', () => {
        // given
        session.ChooseAResponse = {
          response: 'proceedButDisagree'
        };

        // when
        const step = new ChooseAResponse({ session });
        step.retrieve()
          .validate();

        // then
        const values = step.values();
        expect(values).to.be.an('object');
        expect(values).to.have.property(
          'respWillDefendDivorce',
          'NoNoAdmission'
        );
      });

      it('set respWillDefendDivorce to Yes if response is defend', () => {
        // given
        session.ChooseAResponse = {
          response: 'defend'
        };

        // when
        const step = new ChooseAResponse({ session });
        step.retrieve()
          .validate();

        // then
        const values = step.values();
        expect(values).to.be.an('object');
        expect(values).to.have.property('respWillDefendDivorce', 'Yes');
      });

      it('throws error for unknown response', () => {
        // given
        session.ChooseAResponse = {
          response: 'blah'
        };

        // when
        const step = new ChooseAResponse({ session });
        step.retrieve()
          .validate();

        // then
        expect(step.values.bind(step)).to
          .throw('Unknown response to behavior or desertion: \'blah\'');
      });
    });
  });

  describe('when reason for divorce is unreasonable behaviour', () => {
    beforeEach(() => {
      session.originalPetition = {
        reasonForDivorce: 'separation-5-years'
      };
    });

    it('redirects to ConfirmDefence page when defend', () => {
      const fields = { response: 'defend' };
      return question.redirectWithField(ChooseAResponse, fields, ConfirmDefence, session);
    });

    it('renders specific behaviour info', () => {
      return content(
        ChooseAResponse,
        session,
        {
          specificContent: [
            'info.options.hardship.heading',
            'info.options.hardship.text1',
            'info.options.hardship.text2',
            'info.options.hardship.text3',
            'info.options.hardship.text4',
            'info.options.hardship.text5',
            'info.options.hardship.text6',
            'info.options.hardship.text7'
          ]
        }
      );
    });
  });
});
