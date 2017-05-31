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

var getInjectedGetVar = function(options) {
  options = options || {};
  return require('inject-loader!../getVar')({
    document: {
      location: {
        protocol: 'testProtocol',
        hostname: 'testHostname'
      }
    },
    window: options.window || {},
    './state': options.state || {
      getDataElementDefinition: noop
    },
    './public/getDataElementValue': options.getDataElementValue || noop,
    './public/getUri': options.getUri || function() {
      return 'testUri';
    },
    './public/getQueryParam': options.getQueryParam || noop,
    './cleanText': options.cleanText || noop
  });
};

describe('getVar', function() {
  it('returns a data element value', function() {
    var getVar = getInjectedGetVar({
      state: {
        getDataElementDefinition: function() {
          return {};
        }
      },
      getDataElementValue: function() {
        return 'dataElementValue';
      }
    });

    expect(getVar('foo')).toBe('dataElementValue');
  });

  it('returns the URI', function() {
    var getVar = getInjectedGetVar();
    expect(getVar('uri')).toBe('testUri');
    expect(getVar('URI')).toBe('testUri');
  });

  it('returns the protocol', function() {
    var getVar = getInjectedGetVar();
    expect(getVar('protocol')).toBe('testProtocol');
  });

  it('returns the hostname', function() {
    var getVar = getInjectedGetVar();
    expect(getVar('hostname')).toBe('testHostname');
  });

  it('returns property on element using "this." prefix', function() {
    var getVar = getInjectedGetVar();
    var value = getVar('this.foo', {
      element: {
        foo: 'bar'
      }
    });
    expect(value).toBe('bar');
  });

  it('returns textContent of element when using this.@text', function() {
    var getVar = getInjectedGetVar();

    var value = getVar('this.@text', {
      element: {
        textContent: 'bar'
      }
    });

    expect(value).toBe('bar');
  });

  it('returns attribute of element when using this.getAttribute()', function() {
    // This applies to several of the prefix tokens and not just "this.".
    var getVar = getInjectedGetVar();

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
    var getVar = getInjectedGetVar({
      cleanText: function(value) {
        return 'cleaned:' + value;
      }
    });

    var value = getVar('this.@cleanText', {
      element: {
        textContent: 'bar'
      }
    });

    expect(value).toBe('cleaned:bar');
  });

  it('returns property on event using "event." prefix', function() {
    var getVar = getInjectedGetVar();

    var value = getVar('event.foo', {
      foo: 'bar'
    });

    expect(value).toBe('bar');
  });

  it('returns property on event.target using "target." prefix', function() {
    var getVar = getInjectedGetVar();

    var value = getVar('target.foo', {
      target: {
        foo: 'bar'
      }
    });

    expect(value).toBe('bar');
  });

  it('returns property on window using "window." prefix', function() {
    var getVar = getInjectedGetVar({
      window: {
        foo: 'bar'
      }
    });

    expect(getVar('window.foo')).toBe('bar');
  });

  it('returns query string parameter value using "param." prefix', function() {
    var getVar = getInjectedGetVar({
      getQueryParam: function() {
        return 'bar';
      }
    });

    expect(getVar('param.foo')).toBe('bar');
  });

  it('returns a random number using "rand#" for some random reason', function() {
    var getVar = getInjectedGetVar();

    var value = getVar('rand8');

    expect(value).toEqual(jasmine.any(String));
    expect(value.length).toBe(8);
  });

  it('returns property on a custom var', function() {
    var getVar = getInjectedGetVar({
      state: {
        getDataElementDefinition: noop,
        customVars: {
          foo: {
            bar: 'unicorn'
          }
        }
      }
    });

    expect(getVar('foo.bar')).toBe('unicorn');
  });
});
