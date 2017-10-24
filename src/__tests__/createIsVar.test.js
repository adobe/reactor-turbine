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
var createIsVar = require('../createIsVar');

describe('function returned by createIsVar', function() {
  var customVars;
  var getDataElementDefinition;

  beforeEach(function() {
    customVars = {};
    getDataElementDefinition = function() {};
  });

  it('returns true for an existing data element value', function() {
    getDataElementDefinition = function() {
      return {};
    };
    var isVar = createIsVar(customVars, getDataElementDefinition);

    expect(isVar('foo.bar.baz')).toBe(true);
  });

  it('returns true for name using "this." prefix', function() {
    var isVar = createIsVar(customVars, getDataElementDefinition);

    expect(isVar('this.foo')).toBe(true);
  });

  it('returns true for name using "event." prefix', function() {
    var isVar = createIsVar(customVars, getDataElementDefinition);

    expect(isVar('event.foo')).toBe(true);
  });

  it('returns true for name using "target." prefix', function() {
    var isVar = createIsVar(customVars, getDataElementDefinition);

    expect(isVar('target.foo')).toBe(true);
  });

  it('returns true for an existing custom var', function() {
    customVars = {
      foo: {
        bar: 'unicorn'
      }
    };
    var isVar = createIsVar(customVars, getDataElementDefinition);

    expect(isVar('foo.bar')).toBe(true);
  });
});
