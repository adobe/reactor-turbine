'use strict';

var getDataElement = require('getDataElement');

/**
 * Logged in condition. Determines if the user is logged in.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string} config.conditionConfig.dataElementName The name of the data element identifying
 * whether the user is logged in.
 * @returns {boolean}
 */
module.exports = function(config) {
  return Boolean(getDataElement(config.conditionConfig.dataElementName, true));
};

