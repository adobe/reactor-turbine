'use strict';

var conditionDelegateInjector = require('inject!../cookieOptOut');
var publicRequire = require('../../../../../engine/publicRequire');
var conditionDelegate = conditionDelegateInjector({
  getCookie: publicRequire('getCookie')
});

var setCookie = require('../../../../../engine/utils/cookie/setCookie');
var removeCookie = require('../../../../../engine/utils/cookie/removeCookie');

describe('cookie opt-out condition delegate', function() {
  var runTests = function(customCookieName) {
    var cookieName = 'sat_track';

    if (customCookieName) {
      cookieName = customCookieName;
    }

    var getConfig = function(acceptsCookies) {
      var config = {
        conditionConfig: {
          acceptsCookies: acceptsCookies
        },
        propertyConfig: {}
      };

      if (customCookieName) {
        config.propertyConfig.euCookieName = cookieName;
      }

      return config;
    };

    it('returns true when the cookie is set to "true" and acceptsCookies is true', function() {
      setCookie(cookieName, 'true');
      var config = getConfig(true);
      expect(conditionDelegate(config)).toBe(true);
      removeCookie(cookieName);
    });

    it('returns false when the cookie is set to "false" and acceptsCookies is true', function() {
      setCookie(cookieName, 'false');
      var config = getConfig(true);
      expect(conditionDelegate(config)).toBe(false);
      removeCookie(cookieName);
    });

    it('returns false when the cookie is set to "true" and acceptsCookies is false', function() {
      setCookie(cookieName, 'true');
      var config = getConfig(false);
      expect(conditionDelegate(config)).toBe(false);
      removeCookie(cookieName);
    });

    it('returns true when the cookie is set to "false" and acceptsCookies is false', function() {
      setCookie(cookieName, 'false');
      var config = getConfig(false);
      expect(conditionDelegate(config)).toBe(true);
      removeCookie(cookieName);
    });

    it('returns false when the cookie has not been set and acceptsCookies is true', function() {
      var config = getConfig(true);
      expect(conditionDelegate(config)).toBe(false);
    });

    it('returns false when the cookie has not been set and acceptsCookies is false', function() {
      var config = getConfig(false);
      expect(conditionDelegate(config)).toBe(false);
    });
  };

  runTests();
  runTests('sat_custom_track');
});
