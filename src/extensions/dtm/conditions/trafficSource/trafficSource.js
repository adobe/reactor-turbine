'use strict';

var document = require('document');
var getCookie = require('getCookie');
var setCookie = require('setCookie');
var textMatch = require('textMatch');

var COOKIE_NAME = '_sdsat_traffic_source';

var trafficSource = getCookie(COOKIE_NAME);

// Store the traffic source. This needs to run regardless of whether the condition runs so as to
// persist the referrer of the first page.
if (trafficSource == null) {
  trafficSource = document.referrer;
  setCookie(COOKIE_NAME, trafficSource);
}

/**
 * Traffic source condition. Determines if the visitor came from a particular traffic source.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string} config.conditionConfig.source
 * @returns {boolean}
 */
module.exports = function(config) {
  return textMatch(trafficSource, config.conditionConfig.source);
};

