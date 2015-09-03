'use strict';

var clientInfo = require('clientInfo');

/**
 * Browser condition. Determines if the actual browser matches at least one acceptable browser.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string[]} config.conditionConfig.browsers An array of acceptable browsers.
 * @returns {boolean}
 */
module.exports = function(config) {
  return config.conditionConfig.browsers.indexOf(clientInfo.browser) !== -1;
};

