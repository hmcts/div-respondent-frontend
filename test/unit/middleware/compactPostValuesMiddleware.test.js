const modulePath = 'middleware/compactPostValuesMiddleware';

const compactPostValuesMiddleware = require(modulePath);
const { sinon, expect } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  it('calls next if get request', () => {
    const next = sinon.stub();
    const req = { method: 'GET' };
    const res = {};

    compactPostValuesMiddleware(req, res, next);

    expect(next.called).to.eql(true);
  });

  it('removes null or empty values from body request', () => {
    const next = sinon.stub();
    const req = {
      method: 'POST',
      body: {
        someString: 'some string',
        someArray: [1, false, null, '']
      }
    };
    const res = {};

    compactPostValuesMiddleware(req, res, next);

    expect(req.body.someArray).to.eql([1]);
    expect(req.body.someString).to.eql('some string');
    expect(next.called).to.eql(true);
  });
});