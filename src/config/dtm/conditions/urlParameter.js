var textMatch = require('textMatch');
var getQueryParam = require('getQueryParam');

module.exports = function(settings) {
  return textMatch(getQueryParam(settings.name), settings.value);
};

