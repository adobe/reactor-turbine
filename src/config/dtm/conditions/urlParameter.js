'use strict';

var textMatch = require('textMatch');
var getQueryParam = require('getQueryParam');

/**
 * URL parameter condition. Determines if there is a querystring parameter with a matching name
 * and value.
 * @param {Object} settings
 * @param {Object} settings.conditionSettings Condition settings.
 * @param {string} settings.conditionSettings.name The name of the querystring parameter.
 * @param {string} settings.conditionSettings.value The value of the querystring parameter.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return textMatch(getQueryParam(settings.conditionSettings.name), settings.conditionSettings.value);
};

