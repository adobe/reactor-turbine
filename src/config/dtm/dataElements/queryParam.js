var getQueryParam = require('getQueryParam');

module.exports = function(settings) {
  return getQueryParam(settings.name, settings.ignoreCase);
};
