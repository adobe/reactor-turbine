'use strict';

var getCookie = require('getCookie');

module.exports = function(config) {
  return getCookie(config.dataElementConfig.name);
};
