'use strict';

var getDataElement = require('getDataElement');

/**
 * Registered user condition. Determines if the user is a registered user.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string} config.conditionConfig.dataElementName The name of the data element identifying
 * whether the user is a registered user.
 * @returns {boolean}
 */
module.exports = function(config) {
  return Boolean(getDataElement(config.conditionConfig.dataElementName, true));
};

