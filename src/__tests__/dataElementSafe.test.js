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
var dataElementSafe = require('../dataElementSafe');

describe('dataElementSafe', function () {
  beforeEach(function () {
    cookie.set('_sdsat_foo', '');
    window.sessionStorage.removeItem('com.adobe.reactor.dataElements.foo');
    window.localStorage.removeItem('com.adobe.reactor.dataElements.foo');
    window.localStorage.removeItem('com.adobe.reactor.dataElements.baz');
    window.localStorage.removeItem(
      'com.adobe.reactor.dataElementCookiesMigrated'
    );
  });

  it('sets/gets value for pageview duration', function () {
    dataElementSafe.setValue('foo', 'pageview', 'bar');

    expect(dataElementSafe.getValue('foo', 'pageview')).toEqual('bar');
  });

  it('sets/gets value for session duration', function () {
    dataElementSafe.setValue('foo', 'session', 'bar');

    expect(dataElementSafe.getValue('foo', 'session')).toBe('bar');
    expect(
      window.sessionStorage.getItem('com.adobe.reactor.dataElements.foo')
    ).toBe('"bar"');
  });

  it('sets/gets value for visitor duration', function () {
    dataElementSafe.setValue('baz', 'visitor', 'qux');

    expect(dataElementSafe.getValue('baz', 'visitor')).toBe('qux');
    expect(
      window.localStorage.getItem('com.adobe.reactor.dataElements.baz')
    ).toBe('"qux"');
  });

  ['pageview', 'session', 'visitor'].forEach(function (storageDuration) {
    it('returns null when never previously stored', function () {
      expect(
        dataElementSafe.getValue('neverstored', storageDuration)
      ).toBeNull();
    });

    it('maintains string type', function () {
      dataElementSafe.setValue('foo', storageDuration, 'bar');
      expect(dataElementSafe.getValue('foo', storageDuration)).toBe('bar');
    });

    it('maintains number type', function () {
      dataElementSafe.setValue('foo', storageDuration, 123);
      expect(dataElementSafe.getValue('foo', storageDuration)).toBe(123);
    });

    it('maintains boolean type', function () {
      dataElementSafe.setValue('foo', storageDuration, true);
      expect(dataElementSafe.getValue('foo', storageDuration)).toBe(true);
    });

    it('maintains plain object type', function () {
      dataElementSafe.setValue('foo', storageDuration, { baz: 'qux' });
      expect(dataElementSafe.getValue('foo', storageDuration)).toEqual({
        baz: 'qux'
      });
    });

    it('maintains array type', function () {
      dataElementSafe.setValue('foo', storageDuration, ['a', 'b']);
      expect(dataElementSafe.getValue('foo', storageDuration)).toEqual([
        'a',
        'b'
      ]);
    });
  });

  it('maintains non-serializable types for pageview duration', function () {
    var fn = function () {};
    dataElementSafe.setValue('foo', 'pageview', fn);
    expect(dataElementSafe.getValue('foo', 'pageview')).toBe(fn);
  });

  ['session', 'visitor'].forEach(function (storageDuration) {
    it("doesn't store non-serializeable types for session or visitor duration", function () {
      // Things like dates and regular expressions are odd because they are serializable but
      // aren't deserialized to their proper types. We don't do anything special for such values.
      // Consumers trying to store such values will be provided unexpected values upon retrieval.
      dataElementSafe.setValue('foo', storageDuration, function () {});
      expect(dataElementSafe.getValue('foo', storageDuration)).toBeNull();
    });
  });
});
