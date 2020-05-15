'use strict';

const CONF = require('config');
const launchDarkly = require('launchdarkly-node-server-sdk');

class LaunchDarkly {
  constructor() {
    this.ready = false;
    const options = CONF.featureToggles.enabled ? { diagnosticOptOut: true } : { offline: true };
    this.client = launchDarkly.init(CONF.featureToggles.launchDarklyKey, options);
    this.client.once('ready', () => {
      this.ready = true;
    });
  }

  variation(...params) {
    if (this.ready) {
      return this.client.variation(...params);
    }

    return this.client.once('ready', () => {
      this.ready = true;
      return this.client.variation(...params);
    });
  }

  close() {
    this.client.close();
  }
}

class Singleton {
  constructor(options = {}, ftValue = {}) {
    if (!Singleton.instance) {
      Singleton.instance = new LaunchDarkly(options, ftValue);

      process.on('SIGINT', () => {
        return this.close;
      });
      process.on('exit', () => {
        return this.close;
      });
    }
  }

  getInstance() {
    return Singleton.instance;
  }

  close() {
    Singleton.instance.close();
    Singleton.instance = null;
  }
}

module.exports = Singleton;
