const modulePath = 'services/postcodeLookup';

const config = require('config');
const postcodeLookupService = require(modulePath);
const request = require('request-promise-native');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

const mockAddressResponse = {
  results: [
    {
      DPA: {
        ADDRESS: '1, WILBERFORCE ROAD, LONDON, N4 2SW'
      }
    },
    {
      DPA: {
        ADDRESS: '2, WILBERFORCE ROAD, LONDON, N4 2SW',
        BUILDING_NUMBER: '2'
      }
    }
  ]
};


describe(modulePath, () => {
  describe('#formatAddress', () => {
    it('returns address as string', () => {
      const testAddress = {
        DPA: {
          ADDRESS: '1, WILBERFORCE ROAD, LONDON, N4 2SW'
        }
      };

      const address = postcodeLookupService.formatAddress(testAddress);

      expect(address).to.eql('1, WILBERFORCE ROAD, LONDON, N4 2SW');
    });

    it('merges building number and line 1', () => {
      const testAddress = {
        DPA: {
          ADDRESS: '1, WILBERFORCE ROAD, LONDON, N4 2SW',
          BUILDING_NUMBER: '1'
        }
      };

      const address = postcodeLookupService.formatAddress(testAddress);

      expect(address).to.eql('1 WILBERFORCE ROAD, LONDON, N4 2SW');
    });
  });

  describe('#postcodeLookup', () => {
    beforeEach(() => {
      sinon.stub(request, 'get');
    });

    afterEach(() => {
      request.get.restore();
    });

    it('gets address from postcode', done => {
      const postcode = 'postcode';
      const uri = `${config.services.postcode.baseUrl}/addresses/postcode?postcode=${encodeURIComponent(postcode)}&key=${config.services.postcode.token}`; // eslint-disable-line

      request.get.resolves(mockAddressResponse);
      postcodeLookupService.postcodeLookup(postcode)
        .then(addresses => {
          sinon.assert.calledWith(request.get, { uri, json: true });
          expect(addresses).to.eql([
            '1, WILBERFORCE ROAD, LONDON, N4 2SW',
            '2 WILBERFORCE ROAD, LONDON, N4 2SW'
          ]);
        })
        .then(done, done);
    });

    it('throws error if bad request', () => {
      const error = new Error('error getting postcode');
      const postcode = 'postcode';

      request.get.rejects(error);

      return expect(postcodeLookupService.postcodeLookup(postcode))
        .to.be.rejectedWith(error);
    });
  });
});
