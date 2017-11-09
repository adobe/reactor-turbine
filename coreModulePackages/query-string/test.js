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
'use strict';

var queryString = require('./index');

describe('queryString', function() {
  describe('parse', function() {
    ['?', '#', '&'].forEach(function(char) {
      it('supports leading ' + char, function() {
        expect(queryString.parse(char + 'foo=bar')).toEqual({ foo: 'bar' });
      });
    });

    it('does not support additional options supported by underlying implementation', function() {
      expect(queryString.parse('foo=bar;baz=qux', ';')).not.toEqual({ foo: 'bar', baz: 'qux' });
    });
  });

  describe('stringify', function() {
    it('does not support additional options supported by underlying implementation', function() {
      expect(queryString.stringify({ foo: 'bar', baz: 'qux' }, ';')).toEqual('foo=bar&baz=qux');
    });
  });

  it('does not expose other methods supported by the underlying implementation', function() {
    expect(Object.keys(queryString).length).toBe(2);
  });
});
