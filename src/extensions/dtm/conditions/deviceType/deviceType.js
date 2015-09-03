'use strict';

var clientInfo = require('clientInfo');

/**
 * Device type condition. Determines if the actual device type matches at least one acceptable
 * device type.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string[]} config.conditionConfig.deviceTypes An array of device types.
 * @returns {boolean}
 */
module.exports = function(config) {
  return config.conditionConfig.deviceTypes.indexOf(clientInfo.deviceType) !== -1;
};

