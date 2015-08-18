'use strict';

var clientInfo = require('clientInfo');

/**
 * Device type condition. Determines if the current device type matches one of the
 * selected options.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string[]} config.conditionConfig.deviceTypes An array of device type
 * names. The condition will return true if the current device type matches one of these
 * device type names.
 * @returns {boolean}
 */
module.exports = function(config) {
  return config.conditionConfig.deviceTypes.indexOf(clientInfo.deviceType) !== -1;
};

