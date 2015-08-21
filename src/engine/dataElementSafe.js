var setCookie = require('./utils/cookie/setCookie');
var getCookie = require('./utils/cookie/getCookie');

var COOKIE_PREFIX = '_sdsat_';

var length = {
  PAGEVIEW: 'pageview',
  SESSION: 'session',
  VISITOR: 'visitor'
};

var pageviewCache = {};

module.exports = function(key, length) {
  if (arguments.length > 2) {
    // setter
    var value = arguments[2];
    if (length === length.PAGEVIEW) {
      pageviewCache[key] = value;
    } else if (length === length.SESSION) {
      setCookie(COOKIE_PREFIX + key, value);
    } else if (length === length.VISITOR) {
      setCookie(COOKIE_PREFIX + key, value, 365 * 2);
    }
  } else {
    // getter
    if (length === length.PAGEVIEW) {
      return pageviewCache[key];
    } else if (length === length.SESSION || length === length.VISITOR) {
      return getCookie(COOKIE_PREFIX + key);
    }
  }
};
