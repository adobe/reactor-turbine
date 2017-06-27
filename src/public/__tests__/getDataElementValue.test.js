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

describe('getDataElementValue', function() {
  var logger;
  var getInjectedGetDataElementValue = function(options) {
    var cleanText = options.cleanText || function() {};
    return require('inject-loader!../getDataElementValue')({
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

  it('does not return default value if cached value is present', function() {
    var getDataElementValue = getInjectedGetDataElementValue({
      state: {
        getDataElementDefinition: function() {
          return {
            defaultValue: 'defaultValue',
            storageDuration: 'pageview',
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

  [undefined, null].forEach(function(dataElementValue) {
    it('returns a cached value if current value is ' + dataElementValue, function() {
      var getDataElementValue = getInjectedGetDataElementValue({
        state: {
          getDataElementDefinition: function() {
            return {
              storageDuration: 'session',
              settings: {}
            };
          },
          getModuleExports: function() {
            return function() {
              return dataElementValue;
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

    it('returns a default value if value is ' + dataElementValue, function() {
      var getDataElementValue = getInjectedGetDataElementValue({
        state: {
          getDataElementDefinition: function() {
            return {
              defaultValue: 'defaultValue',
              settings: {}
            };
          },
          getModuleExports: function() {
            return function() {
              return dataElementValue;
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

    it('returns an empty string if value is ' + dataElementValue +
      ' and default is undefined', function() {
      var getDataElementValue = getInjectedGetDataElementValue({
        state: {
          getDataElementDefinition: function() {
            return {
              settings: {}
            };
          },
          getModuleExports: function() {
            return function() {
              return dataElementValue;
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
  });

  ['', 0, false, NaN].forEach(function(dataElementValue) {
    it('does not return a default value if value is ' + dataElementValue, function() {
      var getDataElementValue = getInjectedGetDataElementValue({
        state: {
          getDataElementDefinition: function() {
            return {
              defaultValue: 'defaultValue',
              settings: {}
            };
          },
          getModuleExports: function() {
            return function() {
              return dataElementValue;
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
      expect(value).toEqual(dataElementValue);
    });
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
