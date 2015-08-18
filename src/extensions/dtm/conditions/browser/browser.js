'use strict';

var clientInfo = require('clientInfo');

/**
 * Browser condition. Determines if the current browser matches one of the selected options.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string[]} [config.conditionConfig.browsers] An array of browser names. The condition
 * will return true if the current browser matches one of these browser names.
 * @returns {boolean}
 */
module.exports = function(config) {
  return config.conditionConfig.browsers.indexOf(clientInfo.browser) !== -1;
};

