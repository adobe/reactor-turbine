/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

var cookie = require('cookie');

describe('dataElementSafe', function() {
  var mockDate = new Date();
  var dataElementSafe = require('inject!../dataElementSafe')({
    'cookie': cookie
  });

  beforeEach(function() {
    jasmine.clock().mockDate(mockDate);

    spyOn(cookie, 'serialize').and.callThrough();
    spyOn(cookie, 'parse').and.callThrough();
  });

  afterEach(function() {
    jasmine.clock().uninstall();

    cookie.serialize('_sdsat_foo', '');
  });

  it('sets/gets value for pageview duration', function() {
    dataElementSafe.setValue('foo', 'pageview', 'bar');

    expect(dataElementSafe.getValue('foo', 'pageview')).toEqual('bar');
  });

  it('sets/gets value for session duration', function() {
    dataElementSafe.setValue('foo', 'session', 'bar');

    expect(cookie.serialize.calls.argsFor(0)).toEqual(['_sdsat_foo', 'bar']);
    expect(document.cookie.indexOf('_sdsat_foo=bar')).toBeGreaterThan(-1);
    expect(dataElementSafe.getValue('foo', 'session')).toBe('bar');
  });

  it('sets value for visitor duration', function() {
    dataElementSafe.setValue('foo', 'visitor', 'bar');

    var callArgs = cookie.serialize.calls.argsFor(0);
    expect(callArgs[0]).toBe('_sdsat_foo');
    expect(callArgs[1]).toBe('bar');
    expect(callArgs[2].expires.getTime()).toBe(
      mockDate.getTime() + (365 * 2 * 24 * 60 * 60 * 1000)); // 2 years
    expect(document.cookie.indexOf('_sdsat_foo=bar')).toBeGreaterThan(-1);
    expect(dataElementSafe.getValue('foo', 'visitor')).toBe('bar');
  });
});

