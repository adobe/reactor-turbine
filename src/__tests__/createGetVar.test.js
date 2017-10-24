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

var createGetVar = require('../createGetVar');

describe('function returned by createGetVar', function() {
  var customVars;
  var getDataElementDefinition;
  var getDataElementValue;

  beforeEach(function() {
    customVars = {};
    getDataElementDefinition = function() {};
    getDataElementValue = function() {};
  });

  it('returns data element value', function() {
    getDataElementDefinition = function() {
      return {};
    };
    getDataElementValue = function() {
      return 'baz';
    };
    var getVar = createGetVar(customVars, getDataElementDefinition, getDataElementValue);

    expect(getVar('unicorn.foo.bar')).toBe('baz');
  });

  // Accessing nested properties of a data element using dot-notation is unsupported because users
  // can currently create data elements with periods in the name.
  it('does not return nested property of a data element value', function() {
    getDataElementDefinition = function() {
      return {};
    };
    getDataElementValue = function() {
      return {
        foo: {
          bar: 'baz'
        }
      };
    };
    var getVar = createGetVar(customVars, getDataElementDefinition, getDataElementValue);

    expect(getVar('unicorn.foo.bar')).not.toBe('baz');
  });

  it('returns nested property on element using "this." prefix', function() {
    getDataElementValue = function() {
      return 'baz';
    };
    var getVar = createGetVar(customVars, getDataElementDefinition, getDataElementValue);
    var value = getVar('this.foo.bar', {
      element: {
        foo: {
          bar: 'baz'
        }
      }
    });

    expect(value).toBe('baz');
  });

  // This probably sufficiently covers the same use case for the other token prefixes
  it('returns undefined if part of prop chain doesn\'t exist', function() {
    var getVar = createGetVar(customVars, getDataElementDefinition, getDataElementValue);
    var value = getVar('this.goo.bar', {
      element: {
        foo: {
          bar: 'baz'
        }
      }
    });

    expect(value).toBeUndefined();
  });

  it('returns textContent of element when using this.@text', function() {
    var getVar = createGetVar(customVars, getDataElementDefinition, getDataElementValue);
    var value = getVar('this.@text', {
      element: {
        textContent: 'bar'
      }
    });

    expect(value).toBe('bar');
  });

  it('returns attribute of element when using this.getAttribute()', function() {
    var getVar = createGetVar(customVars, getDataElementDefinition, getDataElementValue);
    var value = getVar('this.getAttribute(foo)', {
      element: {
        getAttribute: function(name) {
          return name + 'Value';
        }
      }
    });

    expect(value).toBe('fooValue');
  });

  it('returns textContent of element when using this.@cleanText', function() {
    var getVar = createGetVar(customVars, getDataElementDefinition, getDataElementValue);

    var value = getVar('this.@cleanText', {
      element: {
        textContent: ' bar '
      }
    });

    expect(value).toBe('bar');
  });

  it('returns nested property on event using "event." prefix', function() {
    var getVar = createGetVar(customVars, getDataElementDefinition, getDataElementValue);

    var value = getVar('event.foo.bar', {
      foo: {
        bar: 'baz'
      }
    });

    expect(value).toBe('baz');
  });

  it('returns nested property on event.target using "target." prefix', function() {
    var getVar = createGetVar(customVars, getDataElementDefinition, getDataElementValue);

    var value = getVar('target.foo.bar', {
      target: {
        foo: {
          bar: 'baz'
        }
      }
    });

    expect(value).toBe('baz');
  });

  it('returns nested property on a custom var', function() {
    var customVars = {
      foo: {
        bar: {
          baz: 'unicorn'
        }
      }
    };
    var getVar = createGetVar(customVars, getDataElementDefinition, getDataElementValue);

    expect(getVar('foo.bar.baz')).toBe('unicorn');
  });
});
