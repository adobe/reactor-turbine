'use strict';

var getQueryParam = require('getQueryParam');

module.exports = function(config) {
  return getQueryParam(config.dataElementConfig.name, config.dataElementConfig.ignoreCase);
};
