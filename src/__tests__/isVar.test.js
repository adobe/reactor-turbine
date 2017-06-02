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

var noop = function() {};

var getInjectedIsVar = function(options) {
  options = options || {};
  return require('inject-loader!../isVar')({
    './state': options.state || {
      getDataElementDefinition: noop
    }
  });
};

describe('isVar', function() {
  it('returns true for an existing data element value', function() {
    var isVar = getInjectedIsVar({
      state: {
        getDataElementDefinition: function() {
          return {};
        }
      }
    });

    expect(isVar('foo.bar.baz')).toBe(true);
  });

  it('returns true for name using "this." prefix', function() {
    var isVar = getInjectedIsVar();
    var value = isVar('this.foo');
    expect(value).toBe(true);
  });

  it('returns true for name using "event." prefix', function() {
    var isVar = getInjectedIsVar();

    var value = isVar('event.foo');
    expect(value).toBe(true);
  });

  it('returns true for name using "target." prefix', function() {
    var isVar = getInjectedIsVar();

    var value = isVar('target.foo');
    expect(value).toBe(true);
  });

  it('returns true for an existing custom var', function() {
    var getVar = getInjectedIsVar({
      state: {
        getDataElementDefinition: noop,
        customVars: {
          foo: {
            bar: 'unicorn'
          }
        }
      }
    });

    expect(getVar('foo.bar')).toBe(true);
  });
});
