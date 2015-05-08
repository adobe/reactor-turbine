var textMatch = require('textMatch');
var getQueryParam = require('getQueryParam');

module.exports = function(conditionSettings) {
  return textMatch(getQueryParam(conditionSettings.name), conditionSettings.value);
}

