/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

var cookie = require('@adobe/reactor-cookie');

describe('dataElementSafe', function() {
  var mockDate = new Date();
  var dataElementSafe = require('inject-loader!../dataElementSafe')({
    '@adobe/reactor-cookie': cookie
  });

  beforeEach(function() {
    jasmine.clock().mockDate(mockDate);

    spyOn(cookie, 'set').and.callThrough();
    spyOn(cookie, 'get').and.callThrough();
  });

  afterEach(function() {
    jasmine.clock().uninstall();

    cookie.set('_sdsat_foo', '');
  });

  it('sets/gets value for pageview duration', function() {
    dataElementSafe.setValue('foo', 'pageview', 'bar');

    expect(dataElementSafe.getValue('foo', 'pageview')).toEqual('bar');
  });

  it('sets/gets value for session duration', function() {
    dataElementSafe.setValue('foo', 'session', 'bar');

    expect(cookie.set.calls.argsFor(0)).toEqual(['_sdsat_foo', 'bar']);
    expect(document.cookie.indexOf('_sdsat_foo=bar')).toBeGreaterThan(-1);
    expect(dataElementSafe.getValue('foo', 'session')).toBe('bar');
  });

  it('sets/gets value for visitor duration', function() {
    dataElementSafe.setValue('foo', 'visitor', 'bar');

    var callArgs = cookie.set.calls.argsFor(0);
    expect(callArgs[0]).toBe('_sdsat_foo');
    expect(callArgs[1]).toBe('bar');
    expect(callArgs[2].expires).toBe(730); // 2 years
    expect(document.cookie.indexOf('_sdsat_foo=bar')).toBeGreaterThan(-1);
    expect(dataElementSafe.getValue('foo', 'visitor')).toBe('bar');
  });
});

