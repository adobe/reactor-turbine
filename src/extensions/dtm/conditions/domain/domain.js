'use strict';

var document = require('document');

/**
 * Domain condition. Determines if the current location is a matching domain.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {RegEx[]} config.conditionConfig.domains An array of domains. The current domain must
 * match at least one of the listed domains.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hostname = document.location.hostname;

  return config.conditionConfig.domains.some(function(domain) {
    return hostname.match(domain);
  });
};

