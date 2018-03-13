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

var injectCreateGetDataElementValue = require('inject-loader!../createGetDataElementValue');

describe('function returned by createGetDataElementValue', function() {
  var logger;
  var getInjectedCreateGetDataElementValue = function(mocks) {
    mocks = mocks || {};
    mocks['./logger'] = logger;
    return injectCreateGetDataElementValue(mocks);
  };

  beforeEach(function() {
    logger = jasmine.createSpyObj('logger', ['log', 'error']);;
  });

  it('returns a data element value using data element settings', function() {
    var createGetDataElementValue = getInjectedCreateGetDataElementValue();
    var moduleProvider = {
      getModuleExports: function() {
        return function(settings) {
          return settings.foo;
        };
      }
    };
    var getDataElementDefinition = function() {
      return {
        settings: {
          foo: 'bar'
        }
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue =
      createGetDataElementValue(moduleProvider, getDataElementDefinition, undefinedVarsReturnEmpty);
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('bar');
  });

  it('stores the data element value if value exists and storageDuration provided', function() {
    var dataElementSafe = {
      setValue: jasmine.createSpy()
    };
    var createGetDataElementValue = getInjectedCreateGetDataElementValue({
      './dataElementSafe': dataElementSafe
    });
    var moduleProvider = {
      getModuleExports: function() {
        return function(settings) {
          return settings.foo;
        };
      }
    };
    var getDataElementDefinition = function() {
      return {
        storageDuration: 'visitor',
        settings: {
          foo: 'bar'
        }
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue =
      createGetDataElementValue(moduleProvider, getDataElementDefinition, undefinedVarsReturnEmpty);
    getDataElementValue('testDataElement');

    expect(dataElementSafe.setValue).toHaveBeenCalledWith('testDataElement', 'visitor', 'bar');
  });

  it('cleans the value when cleanText = true', function() {
    var createGetDataElementValue =  getInjectedCreateGetDataElementValue({
      './cleanText': function(value) {
        return 'cleaned:' + value;
      }
    });
    var moduleProvider = {
      getModuleExports: function() {
        return function() {
          return 'bar';
        };
      }
    };
    var getDataElementDefinition = function() {
      return {
        cleanText: true,
        settings: {}
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue =
      createGetDataElementValue(moduleProvider, getDataElementDefinition, undefinedVarsReturnEmpty);
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('cleaned:bar');
  });

  it('cleans the default value when cleanText = true', function() {
    var createGetDataElementValue =  getInjectedCreateGetDataElementValue({
      './cleanText': function(value) {
        return 'cleaned:' + value;
      }
    });
    var moduleProvider = {
      getModuleExports: function() {
        return function() {};
      }
    };
    var getDataElementDefinition = function() {
      return {
        cleanText: true,
        defaultValue: 'bar',
        settings: {}
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue =
      createGetDataElementValue(moduleProvider, getDataElementDefinition, undefinedVarsReturnEmpty);
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('cleaned:bar');
  });

  it('returns an empty string when undefinedVarsReturnEmpty = true and data element value' +
    'is undefined', function() {
    var createGetDataElementValue =  getInjectedCreateGetDataElementValue({
      './cleanText': function(value) {
        return 'cleaned:' + value;
      }
    });
    var moduleProvider = {
      getModuleExports: function() {
        return function() {};
      }
    };
    var getDataElementDefinition = function() {
      return {
        settings: {}
      };
    };
    var undefinedVarsReturnEmpty = true;
    var getDataElementValue =
      createGetDataElementValue(moduleProvider, getDataElementDefinition, undefinedVarsReturnEmpty);
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('');
  });

  it('returns null when undefinedVarsReturnEmpty = false and data element ' +
    'does not exist', function() {
    var createGetDataElementValue =  getInjectedCreateGetDataElementValue();
    var moduleProvider = {};
    var getDataElementDefinition = function() {};
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue =
      createGetDataElementValue(moduleProvider, getDataElementDefinition, undefinedVarsReturnEmpty);
    var value = getDataElementValue('testDataElement');

    expect(value).toBe(null);
  });

  it('does not return default value if cached value is present', function() {
    var createGetDataElementValue =  getInjectedCreateGetDataElementValue({
      './dataElementSafe': {
        getValue: function() {
          return 'cachedValue';
        }
      }
    });
    var moduleProvider = {
      getModuleExports: function() {
        return function() {};
      }
    };
    var getDataElementDefinition = function() {
      return {
        defaultValue: 'defaultValue',
        storageDuration: 'pageview',
        settings: {}
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue =
      createGetDataElementValue(moduleProvider, getDataElementDefinition, undefinedVarsReturnEmpty);
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('cachedValue');
  });

  [undefined, null].forEach(function(dataElementValue) {
    it('returns a cached value if current value is ' + dataElementValue, function() {
      var createGetDataElementValue =  getInjectedCreateGetDataElementValue({
        './dataElementSafe': {
          getValue: function() {
            return 'cachedValue';
          }
        }
      });
      var moduleProvider = {
        getModuleExports: function() {
          return function() {
            return dataElementValue;
          };
        }
      };
      var getDataElementDefinition = function() {
        return {
          storageDuration: 'session',
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(moduleProvider,
        getDataElementDefinition, undefinedVarsReturnEmpty);
      var value = getDataElementValue('testDataElement');

      expect(value).toBe('cachedValue');
    });

    it('returns a default value if value is ' + dataElementValue, function() {
      var createGetDataElementValue =  getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function() {
          return function() {
            return dataElementValue;
          };
        }
      };
      var getDataElementDefinition = function() {
        return {
          defaultValue: 'defaultValue',
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(moduleProvider,
        getDataElementDefinition, undefinedVarsReturnEmpty);
      var value = getDataElementValue('testDataElement');

      expect(value).toBe('defaultValue');
    });

    it('returns an empty string if value is ' + dataElementValue +
      ' and default is undefined', function() {
      var createGetDataElementValue =  getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function() {
          return function() {
            return dataElementValue;
          };
        }
      };
      var getDataElementDefinition = function() {
        return {
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(moduleProvider,
        getDataElementDefinition, undefinedVarsReturnEmpty);
      var value = getDataElementValue('testDataElement');

      expect(value).toBe('');
    });
  });

  ['', 0, false, NaN].forEach(function(dataElementValue) {
    it('does not return a default value if value is ' + dataElementValue, function() {
      var createGetDataElementValue =  getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function() {
          return function() {
            return dataElementValue;
          };
        }
      };
      var getDataElementDefinition = function() {
        return {
          defaultValue: 'defaultValue',
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(moduleProvider,
        getDataElementDefinition, undefinedVarsReturnEmpty);
      var value = getDataElementValue('testDataElement');

      expect(value).toEqual(dataElementValue);
    });
  });

  it('lowercases the value if forceLowerCase = true', function() {
    var createGetDataElementValue =  getInjectedCreateGetDataElementValue();
    var moduleProvider = {
      getModuleExports: function() {
        return function(settings) {
          return settings.foo;
        };
      }
    };
    var getDataElementDefinition = function() {
      return {
        forceLowerCase: true,
        settings: {
          foo: 'bAr'
        }
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(moduleProvider, 
      getDataElementDefinition, undefinedVarsReturnEmpty);
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('bar');
  });

  it('lowercases the default value if forceLowerCase = true', function() {
    var createGetDataElementValue =  getInjectedCreateGetDataElementValue();
    var moduleProvider = {
      getModuleExports: function() {
        return function() {
          return;
        };
      }
    };
    var getDataElementDefinition = function() {
      return {
        forceLowerCase: true,
        defaultValue: 'bAr',
        settings: {}
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(moduleProvider, 
      getDataElementDefinition, undefinedVarsReturnEmpty);
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('bar');
  });

  describe('error handling', function() {
    it('logs an error when retrieving data element module exports fails', function() {
      var createGetDataElementValue =  getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function() {
          throw new Error('noob tried to divide by zero');
        }
      };
      var getDataElementDefinition = function() {
        return {
          modulePath: 'hello-world/foo.js',
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(moduleProvider, 
        getDataElementDefinition, undefinedVarsReturnEmpty);
      var value = getDataElementValue('testDataElement');

      expect(value).toBeUndefined();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toStartWith('Failed to execute data element module hello-world/foo.js ' +
        'for data element testDataElement. noob tried to divide by zero');
    });

    it('logs an error when executing data element module exports fails', function() {
      var createGetDataElementValue =  getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function() {
          return function() {
            throw new Error('noob tried to divide by zero');
          };
        }
      };
      var getDataElementDefinition = function() {
        return {
          modulePath: 'hello-world/foo.js',
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(moduleProvider, 
        getDataElementDefinition, undefinedVarsReturnEmpty);
      var value = getDataElementValue('testDataElement');

      expect(value).toBeUndefined();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toStartWith('Failed to execute data element module hello-world/foo.js ' +
        'for data element testDataElement. noob tried to divide by zero');
    });

    it('logs an error when the data element module does not export a function', function() {
      var createGetDataElementValue =  getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function() {
          return {};
        }
      };
      var getDataElementDefinition = function() {
        return {
          modulePath: 'hello-world/foo.js',
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(moduleProvider, 
        getDataElementDefinition, undefinedVarsReturnEmpty);
      var value = getDataElementValue('testDataElement');

      expect(value).toBeUndefined();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toBe('Failed to execute data element module hello-world/foo.js for ' +
        'data element testDataElement. Module did not export a function.');
    });
  });
});
