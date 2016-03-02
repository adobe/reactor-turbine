var cookie = require('cookie');

var COOKIE_PREFIX = '_sdsat_';

var storeLength = {
  PAGEVIEW: 'pageview',
  SESSION: 'session',
  VISITOR: 'visitor'
};

var pageviewCache = {};

module.exports = {
  setValue: function(key, length, value) {
    switch (length) {
      case storeLength.PAGEVIEW:
        pageviewCache[key] = value;
        break;
      case storeLength.SESSION:
        document.cookie = cookie.serialize(COOKIE_PREFIX + key, value);
        break;
      case storeLength.VISITOR:
        var expireDate = new Date();
        expireDate.setTime(expireDate.getTime() + (365 * 2 * 24 * 60 * 60 * 1000)); // 2 years
        document.cookie = cookie.serialize(COOKIE_PREFIX + key, value, {
          expires: expireDate
        });
        break;
    }
  },
  getValue: function(key, length) {
    switch (length) {
      case storeLength.PAGEVIEW:
        return pageviewCache[key];
      case storeLength.SESSION:
      case storeLength.VISITOR:
        return cookie.parse(document.cookie)[COOKIE_PREFIX + key];
    }
  }
};
