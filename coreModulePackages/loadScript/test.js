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

var loadScript = require('./index');

describe('loadScript', function() {
  // "about:" is used so we don't have to make any actual file requests during testing.
  // Typically you would use a legit URL.
  it('returns a promise', function() {
    var promise = loadScript('about:blank');
    expect(promise.then).toBeDefined();
    expect(promise.catch).toBeDefined();
  });

  it('should fulfill with script element when the script is loaded', function(done) {
    loadScript('about:blank').then(function(script) {
      expect(script).toEqual(jasmine.any(HTMLScriptElement));
      done();
    });
  });

  it('should reject with error when script fails to load', function(done) {
    loadScript('about:nonexistant').catch(function(error) {
      expect(error).toEqual(jasmine.any(Error));
      expect(error.message).toBe('Failed to load script about:nonexistant');
      done();
    });
  });
});
