'use strict';

var textMatch = require('textMatch');
var getQueryParam = require('getQueryParam');

/**
 * URL parameter condition. Determines if a querystring parameter exists with a name and value that
 * matches the acceptable name and value.
 * @param {Object} config
 * @param {Object} config.conditionConfig Condition config.
 * @param {string} config.conditionConfig.name The name of the querystring parameter.
 * @param {string} config.conditionConfig.value The value of the querystring parameter.
 * @returns {boolean}
 */
module.exports = function(config) {
  return textMatch(getQueryParam(config.conditionConfig.name), config.conditionConfig.value);
};

