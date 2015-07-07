'use strict';

var getQueryParam = require('getQueryParam');

module.exports = function(settings) {
  return getQueryParam(settings.dataElementSettings.name, settings.dataElementSettings.ignoreCase);
};
