var setCookie = require('./cookie/setCookie');
var getCookie = require('./cookie/getCookie');

var COOKIE_PREFIX = '_sdsat_';

var storeLength = {
  PAGEVIEW: 'pageview',
  SESSION: 'session',
  VISITOR: 'visitor'
};

var pageviewCache = {};

module.exports = function(key, length) {
  if (arguments.length > 2) {
    // setter
    var value = arguments[2];
    if (length === storeLength.PAGEVIEW) {
      pageviewCache[key] = value;
    } else if (length === storeLength.SESSION) {
      setCookie(COOKIE_PREFIX + key, value);
    } else if (length === storeLength.VISITOR) {
      setCookie(COOKIE_PREFIX + key, value, 365 * 2);
    }
  } else {
    // getter
    if (length === storeLength.PAGEVIEW) {
      return pageviewCache[key];
    } else if (length === storeLength.SESSION || length === storeLength.VISITOR) {
      return getCookie(COOKIE_PREFIX + key);
    }
  }
};
