'use strict';

var conditionDelegateInjector = require('inject!../cookieOptOut');
var publicRequire = require('../../../../../engine/publicRequire');
var conditionDelegate = conditionDelegateInjector({
  getCookie: publicRequire('getCookie')
});

var setCookie = require('../../../../../engine/utils/cookie/setCookie');
var removeCookie = require('../../../../../engine/utils/cookie/removeCookie');

describe('cookie opt-out condition delegate', function() {
  afterEach(function() {
    removeCookie('sat_track');
  });

  it('returns true when the sat_cookie is set to "true" and acceptsCookies is true', function() {
    setCookie('sat_track', 'true');

    var config = {
      conditionConfig: {
        acceptsCookies: true
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the sat_cookie is set to "false" and acceptsCookies is true', function() {
    setCookie('sat_track', 'false');

    var config = {
      conditionConfig: {
        acceptsCookies: true
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns false when the sat_cookie is set to "true" and acceptsCookies is false', function() {
    setCookie('sat_track', 'true');

    var config = {
      conditionConfig: {
        acceptsCookies: false
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns true when the sat_cookie is set to "false" and acceptsCookies is false', function() {
    setCookie('sat_track', 'false');

    var config = {
      conditionConfig: {
        acceptsCookies: false
      }
    };

    expect(conditionDelegate(config)).toBe(true);
  });

  it('returns false when the sat_cookie has not been set and acceptsCookies is true', function() {
    var config = {
      conditionConfig: {
        acceptsCookies: true
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });

  it('returns false when the sat_cookie has not been set and acceptsCookies is false', function() {
    var config = {
      conditionConfig: {
        acceptsCookies: false
      }
    };

    expect(conditionDelegate(config)).toBe(false);
  });
});
