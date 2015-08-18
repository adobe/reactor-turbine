'use strict';

var clientInfo = require('clientInfo');

/**
 * Operating system condition. Determines if the current operating system matches one of the
 * selected options.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string[]} [config.conditionConfig.operatingSystems] An array of operating system
 * names. The condition will return true if the current operating system matches one of these
 * operating system names.
 * @returns {boolean}
 */
module.exports = function(config) {
  return config.conditionConfig.operatingSystems.indexOf(clientInfo.os) !== -1;
};

