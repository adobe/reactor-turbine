'use strict';

var document = require('document');

/**
 * Domain condition. Determines if the actual domain matches at least one acceptable domain.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {RegEx[]} config.conditionConfig.domains An array of acceptable domains.
 * @returns {boolean}
 */
module.exports = function(config) {
  var hostname = document.location.hostname;

  return config.conditionConfig.domains.some(function(domain) {
    return hostname.match(domain);
  });
};

