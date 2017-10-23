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
  var noop = function() {};

  it('returns true for an existing data element value', function() {
    var customVars = {};
    var getDataElementDefinition = function() {
      return {};
    };
    var isVar = createIsVar(customVars, getDataElementDefinition);

    expect(isVar('foo.bar.baz')).toBe(true);
  });

  it('returns true for name using "this." prefix', function() {
    var customVars = {};
    var getDataElementDefinition = noop;
    var isVar = createIsVar(customVars, getDataElementDefinition);
    var value = isVar('this.foo');
    expect(value).toBe(true);
  });

  it('returns true for name using "event." prefix', function() {
    var customVars = {};
    var getDataElementDefinition = noop;
    var isVar = createIsVar(customVars, getDataElementDefinition);
    var value = isVar('event.foo');
    expect(value).toBe(true);
  });

  it('returns true for name using "target." prefix', function() {
    var customVars = {};
    var getDataElementDefinition = noop;
    var isVar = createIsVar(customVars, getDataElementDefinition);
    var value = isVar('target.foo');
    expect(value).toBe(true);
  });

  it('returns true for an existing custom var', function() {
    var customVars = {
      foo: {
        bar: 'unicorn'
      }
    };
    var getDataElementDefinition = noop;
    var isVar = createIsVar(customVars, getDataElementDefinition);
    var value = isVar('foo.bar');
    expect(value).toBe(true);
  });
});
