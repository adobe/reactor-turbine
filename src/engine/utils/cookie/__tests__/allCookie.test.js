var getCookie = require('../getCookie');
var setCookie = require('../setCookie');
var removeCookie = require('../removeCookie');

describe('cookie utility', function() {
  it('successfully sets, reads, and removes a cookie', function() {
    var cookieName = 'cookietest';
    var cookieValue = 'TEST_COOKIE';

    setCookie(cookieName, cookieValue, 91);

    expect(document.cookie.indexOf(cookieName + '=' + cookieValue)).toBeGreaterThan(-1);

    expect(getCookie(cookieName)).toEqual('TEST_COOKIE');

    removeCookie(cookieName);

    expect(document.cookie.indexOf(cookieName + '=' + cookieValue)).toBe(-1);
  });
});
