var textMatch = require('textMatch');
var getQueryParam = require('getQueryParam');

/**
 * URL parameter condition. Determines if there is a querystring parameter with a matching name
 * and value.
 * @param {Object} settings Condition settings.
 * @param {string} settings.name The name of the querystring parameter.
 * @param {string} settings.value The value of the querystring parameter.
 * @returns {boolean}
 */
module.exports = function(settings) {
  return textMatch(getQueryParam(settings.name), settings.value);
};

