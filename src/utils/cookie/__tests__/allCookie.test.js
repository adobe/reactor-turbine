var getCookie = require('../getCookie');
var setCookie = require('../setCookie');
var removeCookie = require('../removeCookie');

describe('cookie utilities', function() {
  it('successfully sets, reads, and removes a cookie', function() {
    var cookieName = 'cookiename';
    var cookieValue = 'cookievalue';

    setCookie(cookieName, cookieValue, 91);

    expect(document.cookie.indexOf(cookieName + '=' + cookieValue)).toBeGreaterThan(-1);

    expect(getCookie(cookieName)).toEqual('cookievalue');

    removeCookie(cookieName);

    expect(document.cookie.indexOf(cookieName + '=' + cookieValue)).toBe(-1);
  });
});
