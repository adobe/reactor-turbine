'use strict';

var getInjectedGetDataElementValue = function(options) {
  var cleanText = options.cleanText || function() {};
  return require('inject!../getDataElementValue')({
    '../../state': options.state,
    '../string/cleanText': cleanText
  });
};

describe('getDataElementValue', function() {
  it('returns a data element value using data element settings', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            settings: {
              foo: 'bar'
            }
          };
        },
        getDelegate: function() {
          return {
            exports: function(settings) {
              return settings.foo;
            }
          };
        },
        getPropertySettings: function() {
          return {
            undefinedVarsReturnEmpty: false
          };
        }
      }
    });

    var value = getDataElementValue('testDataElement');
    expect(value).toBe('bar');
  });

  it('cleans text when cleanText = true', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            cleanText: true,
            settings: {}
          };
        },
        getDelegate: function() {
          return {
            exports: function() {
              return 'bar';
            }
          };
        },
        getPropertySettings: function() {
          return {
            undefinedVarsReturnEmpty: false
          };
        }
      },
      cleanText: function(value) {
        return 'cleaned:' + value;
      }
    });

    var value = getDataElementValue('testDataElement');
    expect(value).toBe('cleaned:bar');
  });

  it('returns an empty string when undefinedVarsReturnEmpty = true and data element value' +
    'is undefined', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            settings: {}
          };
        },
        getDelegate: function() {
          return {
            exports: function() {}
          };
        },
        getPropertySettings: function() {
          return {
            undefinedVarsReturnEmpty: true
          };
        }
      }
    });

    var value = getDataElementValue('testDataElement');
    expect(value).toBe('');
  });

  it('returns null when undefinedVarsReturnEmpty = false and data element ' +
    'does not exist', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {},
        getPropertySettings: function() {
          return {
            undefinedVarsReturnEmpty: false
          };
        }
      }
    });

    var value = getDataElementValue('testDataElement');
    expect(value).toBe(null);
  });

  it('returns a cached value if current value is undefined', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            storeLength: 'session',
            settings: {}
          };
        },
        getDelegate: function() {
          return {
            exports: function() {}
          };
        },
        getCachedDataElementValue: function() {
          return 'cachedValue';
        },
        getPropertySettings: function() {
          return {
            undefinedVarsReturnEmpty: false
          };
        }
      }
    });

    var value = getDataElementValue('testDataElement');
    expect(value).toBe('cachedValue');
  });

  it('returns a default value if value is undefined', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            'default': 'defaultValue',
            settings: {}
          };
        },
        getDelegate: function() {
          return {
            exports: function() {}
          };
        },
        getPropertySettings: function() {
          return {
            undefinedVarsReturnEmpty: false
          };
        }
      }
    });

    var value = getDataElementValue('testDataElement');
    expect(value).toBe('defaultValue');
  });

  it('returns an empty string if value is undefined and default is undefined', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            settings: {}
          };
        },
        getDelegate: function() {
          return {
            exports: function() {}
          };
        },
        getPropertySettings: function() {
          return {
            undefinedVarsReturnEmpty: false
          };
        }
      }
    });

    var value = getDataElementValue('testDataElement');
    expect(value).toBe('');
  });

  it('lowercases the value if forceLowerCase = true', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            forceLowerCase: true,
            settings: {
              foo: 'bAr'
            }
          };
        },
        getDelegate: function() {
          return {
            exports: function(settings) {
              return settings.foo;
            }
          };
        },
        getPropertySettings: function() {
          return {
            undefinedVarsReturnEmpty: false
          };
        }
      }
    });

    var value = getDataElementValue('testDataElement');
    expect(value).toBe('bar');
  });
});
