var noop = function() {};

var getInjectedGetVar = function(options) {
  options = options || {};
  return require('inject!../getVar')({
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
      foo: 'bar'
    });
    expect(value).toBe('bar');
  });

  it('returns textContent of element when using this.@text', function() {
    var getVar = getInjectedGetVar();

    var value = getVar('this.@text', {
      textContent: 'bar'
    });

    expect(value).toBe('bar');
  });

  it('returns attribute of element when using this.getAttribute()', function() {
    // This applies to several of the prefix tokens and not just "this.".
    var getVar = getInjectedGetVar();

    var value = getVar('this.getAttribute(foo)', {
      getAttribute: function(name) {
        return name + 'Value';
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
      textContent: 'bar'
    });

    expect(value).toBe('cleaned:bar');
  });

  it('returns property on event using "event." prefix', function() {
    var getVar = getInjectedGetVar();

    var value = getVar('event.foo', null, {
      foo: 'bar'
    });

    expect(value).toBe('bar');
  });

  it('returns property on event.target using "target." prefix', function() {
    var getVar = getInjectedGetVar();

    var value = getVar('target.foo', null, {
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
