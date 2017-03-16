/*************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2016 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by all applicable intellectual property
* laws, including trade secret and copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

'use strict';

describe('getDataElementValue', function() {
  var logger;
  var getInjectedGetDataElementValue = function(options) {
    var cleanText = options.cleanText || function() {};
    return require('inject!../getDataElementValue')({
      '../state': options.state,
      '../cleanText': cleanText,
      '../logger': logger
    });
  };

  beforeEach(function() {
    logger = jasmine.createSpyObj('logger', ['log', 'error']);;
  });

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
        getModuleExports: function() {
          return function(settings) {
            return settings.foo;
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

  it('cleans the value when cleanText = true', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            cleanText: true,
            settings: {}
          };
        },
        getModuleExports: function() {
          return function() {
            return 'bar';
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

  it('cleans the default value when cleanText = true', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            cleanText: true,
            defaultValue: 'bar',
            settings: {}
          };
        },
        getModuleExports: function() {
          return function() {
            return;
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
        getModuleExports: function() {
          return function() {};
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
        getModuleExports: function() {
          return function() {};
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
            defaultValue: 'defaultValue',
            settings: {}
          };
        },
        getModuleExports: function() {
          return function() {};
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
        getModuleExports: function() {
          return function() {};
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
        getModuleExports: function() {
          return function(settings) {
            return settings.foo;
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

  it('lowercases the default value if forceLowerCase = true', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            forceLowerCase: true,
            defaultValue: 'bAr',
            settings: {}
          };
        },
        getModuleExports: function() {
          return function() {
            return;
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

  describe('error handling', function() {
    it('logs an error when retrieving data element module exports fails', function() {
      var getDataElementValue = getInjectedGetDataElementValue({
        state: {
          getDataElementDefinition: function() {
            return {
              modulePath: 'hello-world/foo.js',
              settings: {}
            };
          },
          getModuleExports: function() {
            throw new Error('noob tried to divide by zero');
          },
          getPropertySettings: function() {
            return {
              undefinedVarsReturnEmpty: false
            };
          }
        }
      });

      var value = getDataElementValue('testDataElement');
      expect(value).toBeUndefined();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toStartWith('Failed to execute data element module hello-world/foo.js ' +
        'for data element testDataElement. noob tried to divide by zero');
    });

    it('logs an error when executing data element module exports fails', function() {
      var getDataElementValue = getInjectedGetDataElementValue({
        state: {
          getDataElementDefinition: function() {
            return {
              modulePath: 'hello-world/foo.js',
              settings: {}
            };
          },
          getModuleExports: function() {
            return function() {
              throw new Error('noob tried to divide by zero');
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
      expect(value).toBeUndefined();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toStartWith('Failed to execute data element module hello-world/foo.js ' +
        'for data element testDataElement. noob tried to divide by zero');
    });

    it('logs an error when the data element module does not export a function', function() {
      var getDataElementValue = getInjectedGetDataElementValue({
        state: {
          getDataElementDefinition: function() {
            return {
              modulePath: 'hello-world/foo.js',
              settings: {}
            };
          },
          getModuleExports: function() {
            return {};
          },
          getPropertySettings: function() {
            return {
              undefinedVarsReturnEmpty: false
            };
          }
        }
      });

      var value = getDataElementValue('testDataElement');
      expect(value).toBeUndefined();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toBe('Failed to execute data element module hello-world/foo.js for ' +
        'data element testDataElement. Module did not export a function.');
    });
  });
});
