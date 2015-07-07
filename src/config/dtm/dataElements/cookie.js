'use strict';

var readCookie = require('readCookie');

module.exports = function(config) {
  return readCookie(config.dataElementConfig.name);
};
