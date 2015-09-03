'use strict';

var clientInfo = require('clientInfo');

/**
 * Operating system condition. Determines if the actual operating system matches at least one
 * acceptable operating system.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string[]} config.conditionConfig.operatingSystems An array of acceptable operating
 * systems.
 * @returns {boolean}
 */
module.exports = function(config) {
  return config.conditionConfig.operatingSystems.indexOf(clientInfo.os) !== -1;
};

