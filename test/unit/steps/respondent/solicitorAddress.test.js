const modulePath = 'steps/respondent/solicitor-address/SolicitorAddress.step';

const SolicitorAddress = require(modulePath);
const SolicitorAddressContent = require('steps/respondent/solicitor-address/SolicitorAddress.content');
const idam = require('services/idam');
const { middleware, question, sinon, content, expect, custom } = require('@hmcts/one-per-page-test-suite');
const CheckYourAnswers = require('steps/respondent/check-your-answers/CheckYourAnswers.step');
const postcodeLookup = require('services/postcodeLookup');

const paths = {
  postcode: `${SolicitorAddress.path}/postcode`,
  selectAddress: `${SolicitorAddress.path}/select-address`,
  editAddress: `${SolicitorAddress.path}/edit-address`,
  confirmAddress: `${SolicitorAddress.path}/confirm-address`,
  enterManualAddress: `${SolicitorAddress.path}/manual-address`
};

const mockAddresses = [
  '1\r\nWILBERFORCE ROAD\r\nLONDON\r\nN4 2SW',
  '2\r\nWILBERFORCE ROAD\r\nLONDON\r\nN4 2SW',
  '3\r\nWILBERFORCE ROAD\r\nLONDON\r\nN4 2SW'
];

const customPost = (path, session, fields) => {
  const request = custom(SolicitorAddress)
    .withSetup(req => {
      // on generate session once
      if (!req.session.active()) {
        req.session.generate();
        Object.assign(req.session, { entryPoint: SolicitorAddress.name }, session);
      }
    });

  const server = request.asServer(true);

  return server
    .post(path)
    .type('form')
    .send(fields)
    .redirects(1);
};

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(idam, 'protect')
      .returns(middleware.nextMock);
  });

  afterEach(() => {
    idam.protect.restore();
  });

  describe('postcode lookup', () => {
    describe('content', () => {
      it('correct content', () => {
        const specificContent = [
          'title',
          'noUkPostcode',
          'fields.postcode.label'
        ];
        return content(SolicitorAddress, {}, { specificContent });
      });

      it('does not show content', () => {
        const specificContentToNotExist = [
          'confirmAddressTitle',
          'manualAddressTitle',
          'fields.confirmAddress.label',
          'fields.selectedAddress.label'
        ];
        return content(SolicitorAddress, {}, { specificContentToNotExist });
      });
    });

    describe('errors', () => {
      it('shows error if no postcode entered', () => {
        const fields = { postcode: '' };
        const onlyErrors = ['postcode'];
        const path = paths.postcode;
        return question.testErrors(SolicitorAddress, {}, fields, { onlyErrors, path });
      });

      describe('get addresses for postcode', () => {
        beforeEach(() => {
          sinon.stub(postcodeLookup, 'postcodeLookup')
            .resolves([]);
        });

        afterEach(() => {
          postcodeLookup.postcodeLookup.restore();
        });

        it('shows error if no addresses found', () => {
          const fields = { postcode: 'postcode' };
          const onlyErrors = ['postcode'];
          const path = paths.postcode;
          return question.testErrors(SolicitorAddress, {}, fields, { onlyErrors, path });
        });
      });
    });
  });

  describe('select address', () => {
    let session = {};

    beforeEach(() => {
      session = {
        [SolicitorAddress.name]: {
          postcode: 'postcode',
          postcodeList: mockAddresses
        }
      };
    });

    describe('content', () => {
      it('shows postcode list', () => {
        const specificContent = [
          'title',
          'noUkPostcode',
          'fields.selectedAddress.label'
        ];
        return content(SolicitorAddress, session, { specificContent });
      });

      it('shows address in seperate fields', () => {
        const fields = { selectedAddress: mockAddresses[0] };
        const addressAsArray = mockAddresses[0].split('\r\n');

        const testFieldsInPage = res => {
          addressAsArray.forEach(addressLine => {
            expect(res.text).to.include(`value="${addressLine}"`);
          });
        };

        return customPost(paths.selectAddress, session, fields)
          .expect(testFieldsInPage);
      });

      it('does not show content', () => {
        const specificContentToNotExist = [
          'confirmAddressTitle',
          'manualAddressTitle',
          'fields.confirmAddress.label'
        ];
        return content(SolicitorAddress, {}, { specificContentToNotExist });
      });
    });

    describe('errors', () => {
      it('shows error no address selected', () => {
        const fields = { selectedAddress: '-1' };
        const onlyErrors = ['selectedAddress'];
        const path = paths.selectAddress;
        return question.testErrors(SolicitorAddress, session, fields, { onlyErrors, path });
      });
    });
  });

  describe('edit a selected address', () => {
    let session = {};

    beforeEach(() => {
      session = {
        [SolicitorAddress.name]: {
          postcode: 'postcode',
          postcodeList: mockAddresses
        }
      };
    });

    it('sets address in session', () => {
      const addressAsArray = mockAddresses[0].split('\r\n');
      const fields = {
        'address[0]': addressAsArray[0],
        'address[1]': 'custom line',
        'address[2]': addressAsArray[2],
        'address[3]': addressAsArray[3]
      };

      const testContentOnPage = res => {
        Object.keys(fields).forEach(field => {
          const addressLine = fields[field];

          expect(res.text).to.include(addressLine);
        });
      };

      return customPost(paths.editAddress, session, fields)
        .expect(testContentOnPage);
    });

    it('removes a line from address if empty', () => {
      const addressAsArray = mockAddresses[0].split('\r\n');
      const fields = {
        'address[0]': addressAsArray[0],
        'address[1]': '',
        'address[2]': addressAsArray[2],
        'address[3]': addressAsArray[3]
      };

      const testContentOnPage = res => {
        Object.keys(fields).forEach(field => {
          const addressLine = fields[field];

          expect(res.text).to.include(addressLine);
        });

        expect(res.text).to.not.include(addressAsArray[1]);
      };

      return customPost(paths.editAddress, session, fields)
        .expect(testContentOnPage);
    });

    it('navigates to confirm address', () => {
      const addressAsArray = mockAddresses[0].split('\r\n');
      const fields = {
        'address[0]': addressAsArray[0],
        'address[1]': addressAsArray[1],
        'address[2]': addressAsArray[2],
        'address[3]': addressAsArray[3]
      };

      return custom(SolicitorAddress)
        .withSession({})
        .post(paths.editAddress)
        .type('form')
        .send(fields)
        .expect('Location', paths.confirmAddress);
    });
  });

  describe('manual address', () => {
    describe('content', () => {
      it('shows correct content', () => {
        const specificContent = [
          'manualAddressTitle',
          'enterUkPostcode'
        ];
        const path = paths.enterManualAddress;
        return content(SolicitorAddress, {}, { specificContent, path });
      });

      it('doesnt show incorrect content', () => {
        const specificContentToNotExist = [
          'noUkPostcode',
          'fields.postcode.label',
          'confirmAddressTitle',
          'fields.confirmAddress.label',
          'fields.selectedAddress.label'
        ];
        const path = paths.enterManualAddress;
        return content(SolicitorAddress, {}, { specificContentToNotExist, path });
      });
    });

    describe('errors', () => {
      it('shows error no address selected', () => {
        const fields = { manualAddress: '' };
        const onlyErrors = ['manualAddress'];
        const path = paths.enterManualAddress;
        return question.testErrors(SolicitorAddress, {}, fields, { onlyErrors, path });
      });
    });

    describe('navigates', () => {
      it('to manual address', () => {
        const fields = {
          manualAddress: ''
        };

        return custom(SolicitorAddress)
          .withSession({})
          .post(paths.enterManualAddress)
          .type('form')
          .send(fields)
          .expect('Location', paths.enterManualAddress);
      });

      it('to confirm address', () => {
        const session = {
          [SolicitorAddress.name]: {
            manualAddress: mockAddresses[0].replace(', ', '\r')
          }
        };

        return custom(SolicitorAddress)
          .withSession(session)
          .post(paths.enterManualAddress)
          .expect('Location', paths.confirmAddress);
      });
    });
  });

  describe('confirm address', () => {
    let session = {};

    beforeEach(() => {
      session = { [SolicitorAddress.name]: { address: mockAddresses[0].split('\r\n') } };
    });

    describe('content', () => {
      it('shows correct content', () => {
        const specificContent = [
          'confirmAddressTitle',
          'fields.confirmAddress.label',
          'fields.confirmAddress.yes',
          'fields.confirmAddress.no'
        ];
        const path = paths.confirmAddress;
        return content(SolicitorAddress, session, { specificContent, path });
      });

      it('doesnt show incorrect content', () => {
        const specificContentToNotExist = [
          'title',
          'noUkPostcode',
          'manualAddressTitle',
          'enterUkPostcode',
          'fields.selectedAddress.label',
          'fields.postcode.label'
        ];
        const path = paths.confirmAddress;
        return content(SolicitorAddress, session, { specificContentToNotExist, path });
      });
    });

    describe('errors', () => {
      it('shows error if no answer', () => {
        const onlyErrors = ['confirmAddress'];
        const path = paths.confirmAddress;
        return question.testErrors(SolicitorAddress, {}, {}, { onlyErrors, path });
      });
    });

    describe('navigates', () => {
      it('to check your answers', () => {
        const fields = {
          confirmAddress: 'yes'
        };

        return question.redirectWithField(SolicitorAddress, fields, CheckYourAnswers);
      });

      it('to edit manual address', () => {
        session[SolicitorAddress.name] = { manualAddress: mockAddresses[0].replace(', ', '\n') };
        const fields = {
          confirmAddress: 'no'
        };

        return custom(SolicitorAddress)
          .withSession(session)
          .post(paths.confirmAddress)
          .type('form')
          .send(fields)
          .expect('Location', paths.enterManualAddress);
      });

      it('to edit postcode lookup', () => {
        const fields = {
          confirmAddress: 'no'
        };

        return custom(SolicitorAddress)
          .withSession(session)
          .post(paths.confirmAddress)
          .type('form')
          .send(fields)
          .expect('Location', SolicitorAddress.path);
      });
    });
  });

  it('Returns correct answers', () => {
    const stepData = { address: mockAddresses[0].split('\r\n') };
    const expectedContent = [
      SolicitorAddressContent.en.title,
      ...mockAddresses[0].split('\r\n')
    ];

    return question.answers(SolicitorAddress, stepData, expectedContent);
  });

  describe('watches', () => {
    it('removes corrects fields when postcode changed', () => {
      const instance = new SolicitorAddress({ journey: {} });
      const remove = sinon.stub();

      const watch = instance.watches[`[${SolicitorAddress.name}].postcode`];
      watch('', 'postcode', remove);

      expect(remove).calledWith(`[${SolicitorAddress.name}].selectedAddress`);
      expect(remove).calledWith(`[${SolicitorAddress.name}].address`);
      expect(remove).calledWith(`[${SolicitorAddress.name}].confirmAddress`);
      expect(remove).calledWith(`[${SolicitorAddress.name}].manualAddress`);
    });

    it('removes correct fields when selectedAddress changes', () => {
      const instance = new SolicitorAddress({ journey: {} });
      const remove = sinon.stub();

      const watch = instance.watches[`[${SolicitorAddress.name}].selectedAddress`];
      watch('', mockAddresses[0], remove);

      expect(remove).calledWith(`[${SolicitorAddress.name}].confirmAddress`);
    });

    it('removes correct fields when address changes', () => {
      const instance = new SolicitorAddress({ journey: {} });
      const remove = sinon.stub();

      const watch = instance.watches[`[${SolicitorAddress.name}].address`];
      watch('', mockAddresses[0].split('\r\n'), remove);

      expect(remove).calledWith(`[${SolicitorAddress.name}].confirmAddress`);
    });

    it('removes confirmAddress answer if user answers no', () => {
      const instance = new SolicitorAddress({ journey: {} });
      const remove = sinon.stub();

      const watch = instance.watches[`[${SolicitorAddress.name}].confirmAddress`];
      watch('', 'no', remove);

      expect(remove).calledWith(`[${SolicitorAddress.name}].confirmAddress`);
    });

    it('does not remove confirmAddress answer if user answers yes', () => {
      const instance = new SolicitorAddress({ journey: {} });
      const remove = sinon.stub();

      const watch = instance.watches[`[${SolicitorAddress.name}].confirmAddress`];
      watch('', 'yes', remove);

      expect(remove).not.calledWith(`[${SolicitorAddress.name}].confirmAddress`);
    });

    it('removes correct fields when manualAddress changes', () => {
      const instance = new SolicitorAddress({ journey: {} });
      const remove = sinon.stub();

      const watch = instance.watches[`[${SolicitorAddress.name}].manualAddress`];
      watch('', 'some address', remove);

      expect(remove).calledWith(`[${SolicitorAddress.name}].postcode`);
      expect(remove).calledWith(`[${SolicitorAddress.name}].selectedAddress`);
      expect(remove).calledWith(`[${SolicitorAddress.name}].confirmAddress`);
      expect(remove).calledWith(`[${SolicitorAddress.name}].postcodeList`);
    });
  });

  it('returns correct values when #values is called', () => {
    const address = mockAddresses[0].split('\r\n');

    const req = {
      journey: {},
      session: { SolicitorAddress: { address } }
    };

    const res = {};
    const step = new SolicitorAddress(req, res);
    step.retrieve().validate();

    const _values = step.values();
    expect(_values).to.be.an('object');
    expect(_values.hasOwnProperty('respondentSolicitorAddress')).to.eql(true);
    expect(_values.respondentSolicitorAddress.hasOwnProperty('address')).to.eql(true);
    expect(_values.respondentSolicitorAddress.address).to.eql(address);
  });

  it('returns correct values when #values is called with { super: true }', () => {
    const address = mockAddresses[0].split('\r\n');

    const req = {
      journey: {},
      session: { SolicitorAddress: { address } }
    };

    const res = {};
    const step = new SolicitorAddress(req, res);
    step.retrieve().validate();

    const _values = step.values({ super: true });
    expect(_values).to.be.an('object');
    expect(_values.hasOwnProperty('address')).to.eql(true);
    expect(_values.address).to.eql(address);
  });
});
