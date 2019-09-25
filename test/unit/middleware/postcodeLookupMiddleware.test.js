const modulePath = 'middleware/postcodeLookupMiddleware';

const postcodeLookupMiddleware = require(modulePath);
const postcodeLookup = require('services/postcodeLookup');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

describe(modulePath, () => {
  beforeEach(() => {
    sinon.stub(postcodeLookup, 'postcodeLookup');
  });

  afterEach(() => {
    postcodeLookup.postcodeLookup.restore();
  });

  it('calls next if is GET request', () => {
    const req = { method: 'GET' };
    const next = sinon.stub();
    postcodeLookupMiddleware.getAddressFromPostcode(req, {}, next);
    expect(next.called).to.eql(true);
    expect(postcodeLookup.postcodeLookup.called).to.eql(false);
  });

  it('calls next if no postcode in body', () => {
    const req = { body: {}, method: 'POST' };
    const next = sinon.stub();
    postcodeLookupMiddleware.getAddressFromPostcode(req, {}, next);
    expect(next.called).to.eql(true);
    expect(postcodeLookup.postcodeLookup.called).to.eql(false);
  });

  it('assigns response from postcode lookup to body', done => {
    const req = { body: { postcode: 'postcode' }, method: 'POST' };
    const next = sinon.stub();
    const addresses = [
      '1 WILBERFORCE ROAD, LONDON, N4 2SW',
      '2 WILBERFORCE ROAD, LONDON, N4 2SW'
    ];

    postcodeLookup.postcodeLookup.resolves(addresses);

    postcodeLookupMiddleware.getAddressFromPostcode(req, {}, next)
      .then(() => {
        expect(req.body.hasOwnProperty('postcodeList')).to.eql(true);
        expect(req.body.postcodeList).to.eql(addresses);
        expect(next.called).to.eql(true);
      })
      .then(done, done);
  });

  it('sets postcodelist to empty array if no addresses found', done => {
    const req = { body: { postcode: 'postcode' }, method: 'POST' };
    const next = sinon.stub();

    postcodeLookup.postcodeLookup.rejects();

    postcodeLookupMiddleware.getAddressFromPostcode(req, {}, next)
      .then(() => {
        expect(req.body.hasOwnProperty('postcodeList')).to.eql(true);
        expect(req.body.postcodeList).to.eql([]);
        expect(next.called).to.eql(true);
      })
      .then(done, done);
  });
});
