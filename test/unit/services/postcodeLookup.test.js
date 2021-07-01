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

    it('should format addresses correctly for EC1V 2PD', () => {
      const testAddress = {
        DPA: {
          ADDRESS: 'MOORFIELDS EYE HOSPITAL, 162, CITY ROAD, LONDON, EC1V 2PD',
          ORGANISATION_NAME: 'MOORFIELDS EYE HOSPITAL',
          BUILDING_NUMBER: '162',
          THOROUGHFARE_NAME: 'CITY ROAD',
          POST_TOWN: 'LONDON',
          POSTCODE: 'EC1V 2PD',
          CLASSIFICATION_CODE_DESCRIPTION: 'Hospital'
        }
      };

      const address = postcodeLookupService.formatAddress(testAddress);

      expect(address).to.eql('MOORFIELDS EYE HOSPITAL\r\n162 , CITY ROAD\r\nLONDON\r\nEC1V 2PD');
    });

    it('should format addresses correctly for IG1 1BE', () => {
      const testAddress = {
        DPA: {
          ADDRESS: 'FEET FIRST PARTNERSHIP, 91, CLEMENTS ROAD, ILFORD, IG1 1BE',
          ORGANISATION_NAME: 'FEET FIRST PARTNERSHIP',
          BUILDING_NUMBER: '91',
          THOROUGHFARE_NAME: 'CLEMENTS ROAD',
          POST_TOWN: 'ILFORD',
          POSTCODE: 'IG1 1BE'
        }
      };

      const address = postcodeLookupService.formatAddress(testAddress);

      expect(address).to.eql('FEET FIRST PARTNERSHIP\r\n91 , CLEMENTS ROAD\r\nILFORD\r\nIG1 1BE');
    });

    it('should format addresses correctly for MK17 9QU', () => {
      const testAddress = {
        DPA: {
          ADDRESS: '1, ELEANOR CLOSE, WOBURN, MILTON KEYNES, MK17 9QU',
          BUILDING_NUMBER: '1',
          THOROUGHFARE_NAME: 'ELEANOR CLOSE',
          DEPENDENT_LOCALITY: 'WOBURN',
          POST_TOWN: 'MILTON KEYNES',
          POSTCODE: 'MK17 9QU'
        }
      };

      const address = postcodeLookupService.formatAddress(testAddress);

      expect(address).to.eql('1, ELEANOR CLOSE\r\nWOBURN\r\nMILTON KEYNES\r\nMK17 9QU');
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
      const uri = `${config.services.postcode.baseUrl}/postcode?postcode=${encodeURIComponent(postcode)}&key=${config.services.postcode.token}`; // eslint-disable-line

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
