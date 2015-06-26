var readCookie = require('../readCookie');
var setCookie = require('../setCookie');
var removeCookie = require('../removeCookie');

var rand = Date.now();


describe('Set Cookie', function() {
  // this passes the first time, then fails on subsequent runs
  it('successfully set a cookie with a valid expiration time', function() {
    var cookieName = 'foo'+rand;
    setCookie(cookieName, "TEST_COOKIE", 91);

    var parts = document.cookie.split(';');
    var res = parts.indexOf(cookieName+'=TEST_COOKIE');
    expect(res).toBeGreaterThan(-1);
  });

  it('successfully read a cookie value', function() {
    var cookieName = 'fooReader'+rand;
    setCookie(cookieName, "TEST_COOKIE", 91);

    var value = readCookie(cookieName);

    expect(value).toEqual('TEST_COOKIE');
  });

  it('successfully delete a cookie', function() {
    var cookieName = 'fooDeleter'+rand;
    setCookie(cookieName, "TEST_COOKIE", 91);
    removeCookie(cookieName);

    var parts = document.cookie.split(';');
    var res = parts.indexOf(cookieName+'=TEST_COOKIE');
    expect(res).toBe(-1);
  });

});
