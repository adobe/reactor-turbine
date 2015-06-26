'use strict';

var readCookie = require('readCookie');

module.exports = function(settings) {
  return readCookie(settings.name);
};
