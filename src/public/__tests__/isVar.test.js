var noop = function() {};

var getInjectedIsVar = function(options) {
  options = options || {};
  return require('inject!../isVar')({
    '../state': options.state || {
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

    expect(isVar('foo')).toBe(true);
  });

  it('returns true for URI', function() {
    var isVar = getInjectedIsVar();
    expect(isVar('uri')).toBe(true);
    expect(isVar('URI')).toBe(true);
  });

  it('returns true for protocol', function() {
    var isVar = getInjectedIsVar();
    expect(isVar('protocol')).toBe(true);
  });

  it('returns true for the hostname', function() {
    var isVar = getInjectedIsVar();
    expect(isVar('hostname')).toBe(true);
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

  it('returns true for name using "window." prefix', function() {
    var isVar = getInjectedIsVar();
    expect(isVar('window.foo')).toBe(true);
  });

  it('returns true for name using "param." prefix', function() {
    var isVar = getInjectedIsVar();
    expect(isVar('param.foo')).toBe(true);
  });

  it('returns true for name using "rand#" for some random reason', function() {
    var isVar = getInjectedIsVar();
    expect(isVar('rand8')).toBe(true);
  });

  it('returns property on a custom var', function() {
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
