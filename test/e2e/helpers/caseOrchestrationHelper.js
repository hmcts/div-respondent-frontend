const request = require('request-promise-native');
const fs = require('fs');
const url = require('url');
const socksAgent = require('socks5-https-client/lib/Agent');
const logger = require('@hmcts/nodejs-logging').Logger.getLogger(__filename);
const config = require('config');
const idamConfigHelper = require('./idamConfigHelper');
const caseConfigHelper = require('./caseConfigHelper');

let Helper = codecept_helper; // eslint-disable-line

const mocksPath = 'resources';

class CaseOrchestrationHelper extends Helper {
  createAosCaseForUser(caseDataName) {
    return this._readFile(`${mocksPath}/${caseDataName}.json`, 'utf8')
      .then(caseData => {
        const userToken = idamConfigHelper.getTestToken();
        const caseDataJson = JSON.parse(caseData);
        return this._createAosCaseForUser(userToken, caseDataJson, config.tests.e2e.proxy);
      })
      .then(createCaseResponse => {
        logger.info(`Created case ${createCaseResponse.id} for ${idamConfigHelper.getTestEmail()}`);
        caseConfigHelper.setTestCaseId(createCaseResponse.id);
      });
  }

  // TO DO - move this to a separate node module to be shared by other FE apps
  _createAosCaseForUser(userToken, caseData, proxy) {
    const uri = `${config.services.caseMaintenance.baseUrl}/casemaintenance/version/1/submit`;
    const headers = {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json'
    };

    const options = {
      uri,
      headers,
      body: caseData,
      json: true
    };

    if (proxy) {
      Object.assign(options, this._setupProxy(proxy));
    }
    return request.post(options);
  }

  _setupProxy(proxy) {
    const proxyUrl = url.parse(proxy);

    let proxyOptions = {};

    if (proxyUrl.protocol.indexOf('socks') >= 0) {
      proxyOptions = {
        strictSSL: false,
        agentClass: socksAgent,
        socksHost: proxyUrl.hostname || 'localhost',
        socksPort: proxyUrl.port || 9000
      };
    } else {
      proxyOptions = { proxy: proxyUrl.href };
    }

    return proxyOptions;
  }

  _readFile(fileName, type) {
    return new Promise(((resolve, reject) => {
      fs.readFile(fileName, type, (error, content) => {
        error ? reject(error) : resolve(content);
      });
    }));
  }
}

module.exports = CaseOrchestrationHelper;
