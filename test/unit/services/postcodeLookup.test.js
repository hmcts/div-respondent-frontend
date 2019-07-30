const modulePath = 'services/postcodeLookup';

const config = require('config');
const postcodeLookupService = require(modulePath);
const request = require('request-promise-native');
const { expect, sinon } = require('@hmcts/one-per-page-test-suite');

const mockAddressResponse = {
  results: [
    {
      DPA: {
        BUILDING_NUMBER: '1',
        THOROUGHFARE_NAME: 'WILBERFORCE ROAD',
        POST_TOWN: 'LONDON',
        POSTCODE: 'N4 2SW',
        ADDRESS: '1, WILBERFORCE ROAD, LONDON, N4 2SW'
      }
    },
    {
      DPA: {
        BUILDING_NUMBER: '2',
        THOROUGHFARE_NAME: 'WILBERFORCE ROAD',
        POST_TOWN: 'LONDON',
        POSTCODE: 'N4 2SW',
        ADDRESS: '2, WILBERFORCE ROAD, LONDON, N4 2SW'
      }
    }
  ]
};


describe(modulePath, () => {
  describe('#formatAddress', () => {
    it('returns address as string', () => {
      const address = postcodeLookupService.formatAddress(mockAddressResponse.results[0]);

      expect(address).to.eql('1, WILBERFORCE ROAD\r\nLONDON\r\nN4 2SW');
    });

    it('encodes html entities', () => {
      const testAddress = {
        DPA: {
          BUILDING_NUMBER: '2 & 3',
          THOROUGHFARE_NAME: 'WILBERFORCE ROAD',
          POST_TOWN: 'LONDON',
          POSTCODE: 'N4 2SW',
          ADDRESS: '2, WILBERFORCE ROAD, LONDON, N4 2SW'
        }
      };

      const address = postcodeLookupService.formatAddress(testAddress);

      expect(address).to.eql('2 &amp; 3, WILBERFORCE ROAD\r\nLONDON\r\nN4 2SW');
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
            '1, WILBERFORCE ROAD\r\nLONDON\r\nN4 2SW',
            '2, WILBERFORCE ROAD\r\nLONDON\r\nN4 2SW'
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
