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
var createSettingsFileTransformer = require('../createSettingsFileTransformer');

describe('function returned by createGetDataElementValue', function () {
  var logger;
  var replaceTokens;
  var settingsFileTransformer;
  var getInjectedCreateGetDataElementValue = function (mocks) {
    mocks = mocks || {};
    mocks['./logger'] = logger;
    return injectCreateGetDataElementValue(mocks);
  };

  beforeEach(function () {
    logger = jasmine.createSpyObj('logger', ['log', 'error']);
    replaceTokens = jasmine.createSpy().and.callFake(function (settings) {
      return settings;
    });
    settingsFileTransformer = jasmine.createSpy('settingsFileTransformer');
  });

  it('returns a data element value using data from settings', function () {
    var createGetDataElementValue = getInjectedCreateGetDataElementValue();
    var moduleProvider = {
      getModuleExports: function () {
        return function (settings) {
          return settings.foo;
        };
      },
      getModuleDefinition: function () {
        return {};
      }
    };
    var getDataElementDefinition = function () {
      return {
        settings: {
          foo: 'bar'
        }
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(
      moduleProvider,
      getDataElementDefinition,
      replaceTokens,
      undefinedVarsReturnEmpty,
      settingsFileTransformer
    );
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('bar');
  });

  // DTM-12602 Allows data elements to reference event
  // data when retrieved within the context of a rule execution
  it('returns a data element value using data from event', function () {
    var createGetDataElementValue = getInjectedCreateGetDataElementValue();
    var moduleProvider = {
      getModuleExports: function () {
        return function (settings, event) {
          return event.foo;
        };
      },
      getModuleDefinition: function () {
        return {};
      }
    };
    var getDataElementDefinition = function () {
      return {
        settings: {}
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(
      moduleProvider,
      getDataElementDefinition,
      replaceTokens,
      undefinedVarsReturnEmpty,
      settingsFileTransformer
    );
    var event = {
      foo: 'bar'
    };
    var value = getDataElementValue('testDataElement', event);

    expect(value).toBe('bar');
  });

  it('stores the data element value if value exists and storageDuration provided', function () {
    var dataElementSafe = {
      setValue: jasmine.createSpy()
    };
    var createGetDataElementValue = getInjectedCreateGetDataElementValue({
      './dataElementSafe': dataElementSafe
    });
    var moduleProvider = {
      getModuleExports: function () {
        return function (settings) {
          return settings.foo;
        };
      },
      getModuleDefinition: function () {
        return {};
      }
    };
    var getDataElementDefinition = function () {
      return {
        storageDuration: 'visitor',
        settings: {
          foo: 'bar'
        }
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(
      moduleProvider,
      getDataElementDefinition,
      replaceTokens,
      undefinedVarsReturnEmpty,
      settingsFileTransformer
    );
    getDataElementValue('testDataElement');

    expect(dataElementSafe.setValue).toHaveBeenCalledWith(
      'testDataElement',
      'visitor',
      'bar'
    );
  });

  it('cleans the value when cleanText = true', function () {
    var createGetDataElementValue = getInjectedCreateGetDataElementValue({
      './cleanText': function (value) {
        return 'cleaned:' + value;
      }
    });
    var moduleProvider = {
      getModuleExports: function () {
        return function () {
          return 'bar';
        };
      },
      getModuleDefinition: function () {
        return {};
      }
    };
    var getDataElementDefinition = function () {
      return {
        cleanText: true,
        settings: {}
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(
      moduleProvider,
      getDataElementDefinition,
      replaceTokens,
      undefinedVarsReturnEmpty,
      settingsFileTransformer
    );
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('cleaned:bar');
  });

  it('cleans the default value when cleanText = true', function () {
    var createGetDataElementValue = getInjectedCreateGetDataElementValue({
      './cleanText': function (value) {
        return 'cleaned:' + value;
      }
    });
    var moduleProvider = {
      getModuleExports: function () {
        return function () {};
      },
      getModuleDefinition: function () {
        return {};
      }
    };
    var getDataElementDefinition = function () {
      return {
        cleanText: true,
        defaultValue: 'bar',
        settings: {}
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(
      moduleProvider,
      getDataElementDefinition,
      replaceTokens,
      undefinedVarsReturnEmpty,
      settingsFileTransformer
    );
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('cleaned:bar');
  });

  it(
    'returns undefined when undefinedVarsReturnEmpty = false and data element ' +
      'does not exist',
    function () {
      var createGetDataElementValue = getInjectedCreateGetDataElementValue();
      var moduleProvider = {};
      var getDataElementDefinition = function () {};
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(
        moduleProvider,
        getDataElementDefinition,
        replaceTokens,
        undefinedVarsReturnEmpty,
        settingsFileTransformer
      );
      var value = getDataElementValue('testDataElement');

      expect(value).toBe(undefined);
    }
  );

  it('does not return default value if cached value is present', function () {
    var createGetDataElementValue = getInjectedCreateGetDataElementValue({
      './dataElementSafe': {
        getValue: function () {
          return 'cachedValue';
        }
      }
    });
    var moduleProvider = {
      getModuleExports: function () {
        return function () {};
      },
      getModuleDefinition: function () {
        return {};
      }
    };
    var getDataElementDefinition = function () {
      return {
        defaultValue: 'defaultValue',
        storageDuration: 'pageview',
        settings: {}
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(
      moduleProvider,
      getDataElementDefinition,
      replaceTokens,
      undefinedVarsReturnEmpty,
      settingsFileTransformer
    );
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('cachedValue');
  });

  [undefined, null].forEach(function (dataElementValue) {
    it(
      'returns a cached value if current value is ' + dataElementValue,
      function () {
        var createGetDataElementValue = getInjectedCreateGetDataElementValue({
          './dataElementSafe': {
            getValue: function () {
              return 'cachedValue';
            }
          }
        });
        var moduleProvider = {
          getModuleExports: function () {
            return function () {
              return dataElementValue;
            };
          },
          getModuleDefinition: function () {
            return {};
          }
        };
        var getDataElementDefinition = function () {
          return {
            storageDuration: 'session',
            settings: {}
          };
        };
        var undefinedVarsReturnEmpty = false;
        var getDataElementValue = createGetDataElementValue(
          moduleProvider,
          getDataElementDefinition,
          replaceTokens,
          undefinedVarsReturnEmpty,
          settingsFileTransformer
        );
        var value = getDataElementValue('testDataElement');

        expect(value).toBe('cachedValue');
      }
    );

    it('returns a default value if value is ' + dataElementValue, function () {
      var createGetDataElementValue = getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function () {
          return function () {
            return dataElementValue;
          };
        },
        getModuleDefinition: function () {
          return {};
        }
      };
      var getDataElementDefinition = function () {
        return {
          defaultValue: 'defaultValue',
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(
        moduleProvider,
        getDataElementDefinition,
        replaceTokens,
        undefinedVarsReturnEmpty,
        settingsFileTransformer
      );
      var value = getDataElementValue('testDataElement');

      expect(value).toBe('defaultValue');
    });

    it(
      'returns ' +
        dataElementValue +
        ' when undefinedVarsReturnEmpty = true and data element value' +
        'is ' +
        dataElementValue,
      function () {
        var createGetDataElementValue = getInjectedCreateGetDataElementValue({
          './cleanText': function (value) {
            return 'cleaned:' + value;
          }
        });
        var moduleProvider = {
          getModuleExports: function () {
            return function () {
              return dataElementValue;
            };
          },
          getModuleDefinition: function () {
            return {};
          }
        };
        var getDataElementDefinition = function () {
          return {
            settings: {}
          };
        };
        var undefinedVarsReturnEmpty = true;
        var getDataElementValue = createGetDataElementValue(
          moduleProvider,
          getDataElementDefinition,
          replaceTokens,
          undefinedVarsReturnEmpty,
          settingsFileTransformer
        );
        var value = getDataElementValue('testDataElement');

        expect(value).toBe(dataElementValue);
      }
    );

    it(
      'returns ' +
        dataElementValue +
        ' if value is ' +
        dataElementValue +
        ' and default is undefined',
      function () {
        var createGetDataElementValue = getInjectedCreateGetDataElementValue();
        var moduleProvider = {
          getModuleExports: function () {
            return function () {
              return dataElementValue;
            };
          },
          getModuleDefinition: function () {
            return {};
          }
        };
        var getDataElementDefinition = function () {
          return {
            settings: {}
          };
        };
        var undefinedVarsReturnEmpty = false;
        var getDataElementValue = createGetDataElementValue(
          moduleProvider,
          getDataElementDefinition,
          replaceTokens,
          undefinedVarsReturnEmpty,
          settingsFileTransformer
        );
        var value = getDataElementValue('testDataElement');

        expect(value).toBe(dataElementValue);
      }
    );
  });

  ['', 0, false, NaN].forEach(function (dataElementValue) {
    it(
      'does not return a default value if value is ' + dataElementValue,
      function () {
        var createGetDataElementValue = getInjectedCreateGetDataElementValue();
        var moduleProvider = {
          getModuleExports: function () {
            return function () {
              return dataElementValue;
            };
          },
          getModuleDefinition: function () {
            return {};
          }
        };
        var getDataElementDefinition = function () {
          return {
            defaultValue: 'defaultValue',
            settings: {}
          };
        };
        var undefinedVarsReturnEmpty = false;
        var getDataElementValue = createGetDataElementValue(
          moduleProvider,
          getDataElementDefinition,
          replaceTokens,
          undefinedVarsReturnEmpty,
          settingsFileTransformer
        );
        var value = getDataElementValue('testDataElement');

        expect(value).toEqual(dataElementValue);
      }
    );
  });

  it('lowercases the value if forceLowerCase = true', function () {
    var createGetDataElementValue = getInjectedCreateGetDataElementValue();
    var moduleProvider = {
      getModuleExports: function () {
        return function (settings) {
          return settings.foo;
        };
      },
      getModuleDefinition: function () {
        return {};
      }
    };
    var getDataElementDefinition = function () {
      return {
        forceLowerCase: true,
        settings: {
          foo: 'bAr'
        }
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(
      moduleProvider,
      getDataElementDefinition,
      replaceTokens,
      undefinedVarsReturnEmpty,
      settingsFileTransformer
    );
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('bar');
  });

  it('lowercases the default value if forceLowerCase = true', function () {
    var createGetDataElementValue = getInjectedCreateGetDataElementValue();
    var moduleProvider = {
      getModuleExports: function () {
        return function () {};
      },
      getModuleDefinition: function () {
        return {};
      }
    };
    var getDataElementDefinition = function () {
      return {
        forceLowerCase: true,
        defaultValue: 'bAr',
        settings: {}
      };
    };
    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(
      moduleProvider,
      getDataElementDefinition,
      replaceTokens,
      undefinedVarsReturnEmpty,
      settingsFileTransformer
    );
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('bar');
  });

  it('replaces tokens in settings object', function () {
    var createGetDataElementValue = getInjectedCreateGetDataElementValue();
    var moduleProvider = {
      getModuleExports: function () {
        return function (settings) {
          return settings.foo;
        };
      },
      getModuleDefinition: function () {
        return {};
      }
    };
    var getDataElementDefinition = function () {
      return {
        settings: {
          foo: '%bar%'
        }
      };
    };

    var replaceTokens = function () {
      return {
        foo: 'valueOfBar'
      };
    };

    var undefinedVarsReturnEmpty = false;
    var getDataElementValue = createGetDataElementValue(
      moduleProvider,
      getDataElementDefinition,
      replaceTokens,
      undefinedVarsReturnEmpty,
      settingsFileTransformer
    );
    var value = getDataElementValue('testDataElement');

    expect(value).toBe('valueOfBar');
  });

  it('The dataDef.settings is only handed to settingsFileTransformer once', function () {
    var decorateWithDynamicHostFake = jasmine
      .createSpy('dynamicHostResolver')
      .and.callFake(function (url) {
        return 'https://assets.adobedtm.com' + url;
      });
    settingsFileTransformer = createSettingsFileTransformer(
      true,
      decorateWithDynamicHostFake
    );
    var settingsFileTransformerSpy = jasmine
      .createSpy('settingsFileTransform')
      .and.callFake(settingsFileTransformer);

    var createGetDataElementValue = getInjectedCreateGetDataElementValue();
    var moduleProvider = {
      getModuleExports: function () {
        return function (settings) {
          return settings.foo;
        };
      },
      getModuleDefinition: function () {
        return {
          filePaths: ['someUrl', 'a.b.someUrl', 'someList[].someUrl']
        };
      }
    };

    var dataDef = {
      settings: {
        key: 'value',
        someUrl: '/some/relative/url',
        a: {
          b: {
            value: 'foo',
            secondValue: 'world',
            someUrl: '/some/relative/url'
          },
          nestedList: [{}, {}, {}]
        },
        someList: [{ someUrl: '/some/relative/url' }]
      },
      modulePath: 'core/src/lib/dataElements/customCode.js'
    };
    var getDataElementDefinition = function () {
      return dataDef;
    };
    var replaceTokens = function () {};
    var undefinedVarsReturnEmpty = false;

    var getDataElementValue = createGetDataElementValue(
      moduleProvider,
      getDataElementDefinition,
      replaceTokens,
      undefinedVarsReturnEmpty,
      settingsFileTransformerSpy
    );

    /** --- yes, really call this twice --- **/
    getDataElementValue();
    expect(dataDef.hasTransformedFilePaths).toBeTrue();
    getDataElementValue();
    expect(dataDef.hasTransformedFilePaths).toBeTrue();
    /** ---           ---             --- **/

    expect(dataDef.settings).toEqual({
      key: 'value',
      someUrl: 'https://assets.adobedtm.com/some/relative/url',
      a: {
        b: {
          value: 'foo',
          secondValue: 'world',
          someUrl: 'https://assets.adobedtm.com/some/relative/url'
        },
        nestedList: [{}, {}, {}]
      },
      someList: [{ someUrl: 'https://assets.adobedtm.com/some/relative/url' }]
    });
    expect(settingsFileTransformerSpy).toHaveBeenCalledTimes(1);
  });

  it(
    'is called with an empty settings object if dataDef.settings ' +
      ' is missing',
    function () {
      var decorateWithDynamicHostFake = jasmine
        .createSpy('dynamicHostResolver')
        .and.callFake(function (url) {
          return 'https://assets.adobedtm.com' + url;
        });
      settingsFileTransformer = createSettingsFileTransformer(
        true,
        decorateWithDynamicHostFake
      );
      var settingsFileTransformerSpy = jasmine
        .createSpy('settingsFileTransform')
        .and.callFake(settingsFileTransformer);

      var createGetDataElementValue = getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function () {
          return function (settings) {
            return settings.foo;
          };
        },
        getModuleDefinition: function () {
          return {
            filePaths: ['someUrl', 'a.b.someUrl', 'someList[].someUrl']
          };
        }
      };

      var dataDef = {
        modulePath: 'core/src/lib/dataElements/customCode.js'
      };
      var getDataElementDefinition = function () {
        return dataDef;
      };
      var replaceTokens = function () {};
      var undefinedVarsReturnEmpty = false;

      var getDataElementValue = createGetDataElementValue(
        moduleProvider,
        getDataElementDefinition,
        replaceTokens,
        undefinedVarsReturnEmpty,
        settingsFileTransformerSpy
      );

      getDataElementValue();

      expect(settingsFileTransformerSpy).toHaveBeenCalledWith(
        {},
        moduleProvider.getModuleDefinition().filePaths,
        dataDef.modulePath
      );
    }
  );

  describe('error handling', function () {
    it('logs an error when retrieving data element module exports fails', function () {
      var createGetDataElementValue = getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function () {
          throw new Error('noob tried to divide by zero');
        },
        getModuleDefinition: function () {
          return {};
        }
      };
      var getDataElementDefinition = function () {
        return {
          modulePath: 'hello-world/foo.js',
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(
        moduleProvider,
        getDataElementDefinition,
        replaceTokens,
        undefinedVarsReturnEmpty,
        settingsFileTransformer
      );
      var value = getDataElementValue('testDataElement');

      expect(value).toBeUndefined();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toStartWith(
        'Failed to execute data element module hello-world/foo.js ' +
          'for data element testDataElement. noob tried to divide by zero'
      );
    });

    it('logs an error when executing data element module exports fails', function () {
      var createGetDataElementValue = getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function () {
          return function () {
            throw new Error('noob tried to divide by zero');
          };
        },
        getModuleDefinition: function () {
          return {};
        }
      };
      var getDataElementDefinition = function () {
        return {
          modulePath: 'hello-world/foo.js',
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(
        moduleProvider,
        getDataElementDefinition,
        replaceTokens,
        undefinedVarsReturnEmpty,
        settingsFileTransformer
      );
      var value = getDataElementValue('testDataElement');

      expect(value).toBeUndefined();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toStartWith(
        'Failed to execute data element module hello-world/foo.js ' +
          'for data element testDataElement. noob tried to divide by zero'
      );
    });

    it('logs an error when the data element module does not export a function', function () {
      var createGetDataElementValue = getInjectedCreateGetDataElementValue();
      var moduleProvider = {
        getModuleExports: function () {
          return {};
        },
        getModuleDefinition: function () {
          return {};
        }
      };
      var getDataElementDefinition = function () {
        return {
          modulePath: 'hello-world/foo.js',
          settings: {}
        };
      };
      var undefinedVarsReturnEmpty = false;
      var getDataElementValue = createGetDataElementValue(
        moduleProvider,
        getDataElementDefinition,
        replaceTokens,
        undefinedVarsReturnEmpty,
        settingsFileTransformer
      );
      var value = getDataElementValue('testDataElement');

      expect(value).toBeUndefined();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toBe(
        'Failed to execute data element module hello-world/foo.js for ' +
          'data element testDataElement. Module did not export a function.'
      );
    });
  });
});
