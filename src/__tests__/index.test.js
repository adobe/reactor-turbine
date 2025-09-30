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

var index = require('../index');
var injectIndex = index.injectIndex;
var cloneDeep = require('lodash.clonedeep');
const logger = require('../logger');
var document = require('@adobe/reactor-document');
var objectAssign = require('@adobe/reactor-object-assign');
var createDynamicHostResolver = require('../createDynamicHostResolver');
var buildRuleExecutionOrder = require('../buildRuleExecutionOrder');
var createDebugController = require('../createDebugController');
var createExecuteDelegateModule = require('../createExecuteDelegateModule');
var createGetDataElementValue = require('../createGetDataElementValue');
var createGetVar = require('../createGetVar');
var createIsVar = require('../createIsVar');
var createModuleProvider = require('../createModuleProvider');
var createNotifyMonitors = require('../createNotifyMonitors');
var createReplaceTokens = require('../createReplaceTokens');
var createSetCustomVar = require('../createSetCustomVar');
var createAddActionToQueue = require('../rules/createAddActionToQueue');
var createAddConditionToQueue = require('../rules/createAddConditionToQueue');
var createAddRuleToQueue = require('../rules/createAddRuleToQueue');
var createEvaluateConditions = require('../rules/createEvaluateConditions');
var createExecuteRule = require('../rules/createExecuteRule');
var createGetModuleDisplayNameByRuleComponent = require('../rules/createGetModuleDisplayNameByRuleComponent');
var createGetSyntheticEventMeta = require('../rules/createGetSyntheticEventMeta');
var createInitEventModule = require('../rules/createInitEventModule');
var createLogActionError = require('../rules/createLogActionError');
var createLogConditionError = require('../rules/createLogConditionError');
var createLogConditionNotMet = require('../rules/createLogConditionNotMet');
var createLogRuleCompleted = require('../rules/createLogRuleCompleted');
var createRunActions = require('../rules/createRunActions');
var createTriggerRule = require('../rules/createTriggerRule');
var getRuleComponentErrorMessage = require('../rules/getRuleComponentErrorMessage');
var isConditionMet = require('../rules/isConditionMet');
var initRules = require('../rules/initRules');
var normalizeRuleComponentError = require('../rules/normalizeRuleComponentError');
var normalizeSyntheticEvent = require('../rules/normalizeSyntheticEvent');
var getNamespacedStorage = require('../getNamespacedStorage');
var hydrateModuleProvider = require('../hydrateModuleProvider');
var hydrateSatelliteObject = require('../hydrateSatelliteObject');
var createSettingsFileTransformer = require('../createSettingsFileTransformer');
var loggerMock;
var satelliteMock;

function getRealDeps() {
  return {
    logger,
    document,
    objectAssign,
    createDynamicHostResolver,
    buildRuleExecutionOrder,
    createDebugController,
    createExecuteDelegateModule,
    createGetDataElementValue,
    createGetVar,
    createIsVar,
    createModuleProvider,
    createNotifyMonitors,
    createReplaceTokens,
    createSetCustomVar,
    createAddActionToQueue,
    createAddConditionToQueue,
    createAddRuleToQueue,
    createEvaluateConditions,
    createExecuteRule,
    createGetModuleDisplayNameByRuleComponent,
    createGetSyntheticEventMeta,
    createInitEventModule,
    createLogActionError,
    createLogConditionError,
    createLogConditionNotMet,
    createLogRuleCompleted,
    createRunActions,
    createTriggerRule,
    getRuleComponentErrorMessage,
    isConditionMet,
    initRules,
    normalizeRuleComponentError,
    normalizeSyntheticEvent,
    getNamespacedStorage,
    hydrateModuleProvider,
    hydrateSatelliteObject,
    createSettingsFileTransformer
  };
}
function injectPartialMocks(mockEntries) {
  if (mockEntries && Object.keys(mockEntries).length > 0) {
    return {
      ...getRealDeps(),
      ...mockEntries
    };
  }

  return getRealDeps();
}

describe('index', function () {
  var turbineScriptId = 'turbine-script-id';
  var currentScriptSpy;
  var scriptSrc =
    'https://fake.adobeassets.com:443/launch-ENabc123-development.min.js';

  beforeEach(function () {
    satelliteMock = {
      container: {
        property: {
          settings: {
            undefinedVarsReturnEmpty: true,
            ruleComponentSequencingEnabled: false
          }
        },
        company: {
          dynamicCdnEnabled: true,
          cdnAllowList: undefined
        },
        buildInfo: {
          environment: 'development'
        },
        environment: {
          id: 'environment-id',
          stage: 'test'
        }
      }
    };

    loggerMock = jasmine.createSpyObj('logger', [
      'log',
      'info',
      'debug',
      'warn',
      'error',
      'deprecation'
    ]);

    if (typeof document.currentScript !== 'undefined') {
      // modern browsers
      currentScriptSpy = spyOnProperty(
        document,
        'currentScript',
        'get'
      ).and.returnValue({
        src: scriptSrc,
        getAttribute: function () {
          return scriptSrc;
        }
      });
    } else {
      // IE
      var turbineScript = document.createElement('script');
      turbineScript.id = turbineScriptId;
      turbineScript.src = scriptSrc;
      document.head.appendChild(turbineScript);
    }
  });

  afterEach(function () {
    delete window._satellite;
    delete window.__satelliteLoaded;
    window.localStorage.removeItem('com.adobe.reactor.debug');
    window.localStorage.removeItem('com.adobe.reactor.hideActivity');
    if (document.getElementById(turbineScriptId)) {
      var node = document.getElementById(turbineScriptId);
      node.parentNode.removeChild(node);
    }
  });

  it(
    'in test mode, the resolved window._satellite object is the same as the returned ' +
      'object from createTurbine call',
    function () {
      var createTurbine = injectIndex(getRealDeps());
      var returnedSatellite = createTurbine(satelliteMock);
      expect(window._satellite).toBe(returnedSatellite);
    }
  );

  it('starts up just fine when container.company.cdnAllowList is undefined', function () {
    expect(function () {
      delete satelliteMock.container.company.cdnAllowList;
      var createTurbine = injectIndex(
        injectPartialMocks({
          logger: loggerMock
        })
      );
      createTurbine(satelliteMock);
    }).not.toThrow();

    expect(loggerMock.warn).not.toHaveBeenCalledWith(
      'Please review the following error:'
    );
  });

  it('exports the window._satellite object', function () {
    delete window._satellite;
    var createTurbine = injectIndex(getRealDeps());
    createTurbine(satelliteMock);
    expect(window._satellite).not.toBeFalsy();
  });

  it('prevents turbine from executing multiple times', function () {
    var createModuleProviderMock = jasmine.createSpy();
    var createTurbine = injectIndex(
      injectPartialMocks({
        createModuleProvider: createModuleProviderMock,
        logger: loggerMock
      })
    );

    createTurbine(satelliteMock);
    createTurbine(satelliteMock);

    expect(createModuleProviderMock).toHaveBeenCalledTimes(1);
  });

  it('deletes the container', function () {
    var createTurbine = injectIndex(getRealDeps());
    createTurbine(satelliteMock);
    expect(window._satellite.container).toBe(undefined);
  });

  it(
    'redefines container.buildInfo.environment to point to ' +
      'container.environment.container.stage ',
    function () {
      satelliteMock.container.buildInfo = {
        environment: undefined
      };
      satelliteMock.container.environment = {
        id: 'the-environment-id',
        stage: 'the-environment-stage-in-environment'
      };
      var createTurbine = injectIndex(
        injectPartialMocks({
          logger: loggerMock
        })
      );
      createTurbine(satelliteMock);

      expect(window._satellite.buildInfo.environment).toBe(
        'the-environment-stage-in-environment'
      );
      expect(loggerMock.deprecation).toHaveBeenCalledWith(
        'container.buildInfo.environment is deprecated.' +
          'Please use `container.environment.stage` instead'
      );
    }
  );

  it('creates moduleProvider', function () {
    var createModuleProviderMock = jasmine.createSpy();
    var createTurbine = injectIndex(
      injectPartialMocks({
        createModuleProvider: createModuleProviderMock
      })
    );
    createTurbine(satelliteMock);

    expect(createModuleProviderMock).toHaveBeenCalled();
  });

  it('creates getDataElementValue', function () {
    var createGetDataElementValueMock = jasmine.createSpy();
    var settingsFileTransformerMock = jasmine.createSpy(
      'settingsFileTransformer'
    );
    var createSettingsFileTransformer = function () {
      return settingsFileTransformerMock;
    };
    var moduleProviderMock = function () {};
    var createTurbine = injectIndex(
      injectPartialMocks({
        createGetDataElementValue: createGetDataElementValueMock,
        createModuleProvider: function () {
          return moduleProviderMock;
        },
        createSettingsFileTransformer: createSettingsFileTransformer
      })
    );
    createTurbine(satelliteMock);

    expect(createGetDataElementValueMock).toHaveBeenCalledWith(
      moduleProviderMock,
      jasmine.any(Function),
      jasmine.any(Function),
      true,
      settingsFileTransformerMock
    );
  });

  it('creates setCustomVar', function () {
    var createSetCustomVarMock = jasmine.createSpy();
    var createTurbine = injectIndex(
      injectPartialMocks({
        createSetCustomVar: createSetCustomVarMock,
        logger: loggerMock
      })
    );
    createTurbine(satelliteMock);

    expect(createSetCustomVarMock).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('creates isVar', function () {
    var createIsVarMock = jasmine.createSpy();

    var createTurbine = injectIndex(
      injectPartialMocks({
        createIsVar: createIsVarMock,
        logger: loggerMock
      })
    );
    createTurbine(satelliteMock);

    expect(createIsVarMock).toHaveBeenCalledWith(
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('creates getVar', function () {
    var createGetVarMock = jasmine.createSpy();
    var getDataElementValueMock = function () {};
    var createTurbine = injectIndex(
      injectPartialMocks({
        createGetVar: createGetVarMock,
        createGetDataElementValue: function () {
          return getDataElementValueMock;
        },
        logger: loggerMock
      })
    );

    createTurbine(satelliteMock);

    expect(createGetVarMock).toHaveBeenCalledWith(
      jasmine.any(Object),
      jasmine.any(Function),
      getDataElementValueMock
    );
  });

  it('creates replaceTokens', function () {
    var createReplaceTokensMock = jasmine.createSpy();
    var isVarMock = function () {};
    var getVarMock = function () {};
    var createTurbine = injectIndex(
      injectPartialMocks({
        createReplaceTokens: createReplaceTokensMock,
        createIsVar: function () {
          return isVarMock;
        },
        createGetVar: function () {
          return getVarMock;
        },
        logger: loggerMock
      })
    );
    createTurbine(satelliteMock);

    expect(createReplaceTokensMock).toHaveBeenCalledWith(
      isVarMock,
      getVarMock,
      true
    );
  });

  it('creates namespaced storage', function () {
    var getNamespacedStorageMock = jasmine.createSpy().and.returnValue({
      getItem: function () {}
    });
    const createTurbine = injectIndex(
      injectPartialMocks({
        getNamespacedStorage: getNamespacedStorageMock,
        logger: loggerMock
      })
    );
    createTurbine(satelliteMock);

    expect(getNamespacedStorageMock).toHaveBeenCalledWith('localStorage');
  });

  it("sets logger output enabled when local storage item is 'true'", function () {
    window.localStorage.setItem('com.adobe.reactor.debug', true);

    const createTurbine = injectIndex(
      injectPartialMocks({
        logger: loggerMock
      })
    );
    createTurbine(satelliteMock);

    expect(loggerMock.outputEnabled).toBe(true);
  });

  it(
    'sets logger output disabled when local storage item is anything ' +
      "other than 'true'",
    function () {
      window.localStorage.setItem('com.adobe.reactor.debug', false);

      const createTurbine = injectIndex(
        injectPartialMocks({
          logger: loggerMock
        })
      );
      createTurbine(satelliteMock);

      expect(loggerMock.outputEnabled).toBe(false);
    }
  );

  it('hydrates satellite object', function () {
    var hydrateSatelliteObjectMock = jasmine.createSpy();
    var getVarMock = function () {};
    var setCustomVarMock = function () {};
    const createTurbine = injectIndex(
      injectPartialMocks({
        hydrateSatelliteObject: hydrateSatelliteObjectMock,
        createGetVar: function () {
          return getVarMock;
        },
        createSetCustomVar: function () {
          return setCustomVarMock;
        },
        logger: loggerMock
      })
    );

    const satelliteWithoutContainerMock = cloneDeep(satelliteMock);
    const satelliteContainerMock = cloneDeep(satelliteMock.container);
    delete satelliteWithoutContainerMock.container;
    createTurbine(satelliteMock);

    expect(hydrateSatelliteObjectMock).toHaveBeenCalledWith(
      satelliteWithoutContainerMock,
      jasmine.objectContaining({
        property: satelliteContainerMock.property,
        company: satelliteContainerMock.company,
        buildInfo: {
          environment: satelliteContainerMock.environment.stage
        },
        environment: satelliteContainerMock.environment
      }),
      jasmine.any(Function),
      getVarMock,
      setCustomVarMock
    );
  });

  it('hydrates module provider', function () {
    var hydrateModuleProviderMock = jasmine.createSpy();
    var moduleProvider = { type: 'moduleProvider' };
    var debugController = { type: 'debugController' };
    var replaceTokensMock = jasmine.createSpy('replaceTokens');
    var getDataElementValueMock = jasmine.createSpy('getDataElementValue');
    var settingsFileTransformerMock = jasmine.createSpy(
      'settingsFileTransformer'
    );
    var decorateWithDynamicHostMock = jasmine.createSpy(
      'decorateWithDynamicHost'
    );
    const satelliteContainerMock = cloneDeep(satelliteMock.container);
    var createTurbine = injectIndex(
      injectPartialMocks({
        hydrateModuleProvider: hydrateModuleProviderMock,
        createModuleProvider: function () {
          return moduleProvider;
        },
        createDebugController: function () {
          return debugController;
        },
        createReplaceTokens: function () {
          return replaceTokensMock;
        },
        createGetDataElementValue: function () {
          return getDataElementValueMock;
        },
        createDynamicHostResolver: function () {
          return {
            decorateWithDynamicHost: decorateWithDynamicHostMock
          };
        },
        createSettingsFileTransformer: function () {
          return settingsFileTransformerMock;
        },
        logger: loggerMock
      })
    );
    createTurbine(satelliteMock);

    expect(hydrateModuleProviderMock).toHaveBeenCalledWith(
      jasmine.objectContaining({
        property: satelliteContainerMock.property,
        company: satelliteContainerMock.company,
        buildInfo: {
          environment: satelliteContainerMock.environment.stage
        },
        environment: satelliteContainerMock.environment
      }),
      moduleProvider,
      debugController,
      replaceTokensMock,
      getDataElementValueMock,
      settingsFileTransformerMock,
      decorateWithDynamicHostMock
    );
  });

  it('initializes rules', function () {
    var rules = [];
    var initRulesMock = jasmine.createSpy();
    var buildRuleExecutionOrderMock = function () {};
    var initEventModuleMock = function () {};
    var createTurbine = injectIndex(
      injectPartialMocks({
        initRules: initRulesMock,
        buildRuleExecutionOrder: buildRuleExecutionOrderMock,
        createInitEventModule: function () {
          return initEventModuleMock;
        },
        logger: loggerMock
      })
    );
    createTurbine(satelliteMock);

    expect(initRulesMock).toHaveBeenCalledWith(
      buildRuleExecutionOrderMock,
      rules,
      initEventModuleMock
    );
  });

  it("provides an empty array for rules when container doesn't have rules", function () {
    delete satelliteMock.container.rules;
    var rules;

    var createTurbine = injectIndex(
      injectPartialMocks({
        initRules: function (_satellite, _rules) {
          rules = _rules;
        },
        logger: loggerMock
      })
    );
    createTurbine(satelliteMock);

    expect(rules).toEqual([]);
  });

  describe('getDataElementDefinition', function () {
    it('returns data elements from container', function () {
      var dataElementDefinition = {
        name: 'foo',
        value: 'bar'
      };
      satelliteMock.container.dataElements = {
        foo: dataElementDefinition
      };
      var getDataElementDefinition;
      var createTurbine = injectIndex(
        injectPartialMocks({
          createIsVar: function (customVars, _getDataElementDefinition) {
            getDataElementDefinition = _getDataElementDefinition;
            return function () {};
          },
          logger: loggerMock
        })
      );
      createTurbine(satelliteMock);

      expect(getDataElementDefinition('foo')).toEqual(dataElementDefinition);
    });

    it("doesn't throw an error when container doesn't have data elements", function () {
      delete satelliteMock.container.dataElements;
      var getDataElementDefinition;
      var createTurbine = injectIndex(
        injectPartialMocks({
          createIsVar: function (customVars, _getDataElementDefinition) {
            getDataElementDefinition = _getDataElementDefinition;
            return function () {};
          },
          logger: loggerMock
        })
      );
      createTurbine(satelliteMock);

      expect(getDataElementDefinition('foo')).toBe(undefined);
    });
  });

  describe('setDebugOutputEnabled', function () {
    it('sets localStorage item', function () {
      var setOutputDebugEnabled;
      var createTurbine = injectIndex(
        injectPartialMocks({
          hydrateSatelliteObject: function (
            _satellite,
            container,
            _setOutputDebugEnabled
          ) {
            setOutputDebugEnabled = _setOutputDebugEnabled;
          },
          logger: loggerMock
        })
      );
      createTurbine(satelliteMock);

      expect(
        window.localStorage.getItem('com.adobe.reactor.debug')
      ).toBeFalsy();

      setOutputDebugEnabled(true);

      expect(window.localStorage.getItem('com.adobe.reactor.debug')).toBe(
        'true'
      );
    });
  });

  describe('dynamic host', function () {
    describe('prompts the user to see the thrown error when', function () {
      describe('there is not a proper turbineEmbedCode', function () {
        beforeEach(function () {
          if (typeof document.currentScript !== 'undefined') {
            // modern browsers
            currentScriptSpy.and.returnValue({
              src: null,
              getAttribute: function () {
                return null;
              }
            });
          }
          if (document.getElementById(turbineScriptId)) {
            // IE. Remove to flag there's no found turbine script
            var node = document.getElementById(turbineScriptId);
            node.parentNode.removeChild(node);
          }
        });

        describe('isDynamicEnforced=true', function () {
          beforeEach(function () {
            satelliteMock.container.company.isDynamicEnforced = true;
          });

          it('and the approved hosts list is empty', function () {
            satelliteMock.container.company.cdnAllowList = [];

            expect(function () {
              var createTurbine = injectIndex(
                injectPartialMocks({
                  logger: loggerMock
                })
              );
              createTurbine(satelliteMock);
            }).toThrowError(
              'Unable to find the Library Embed Code for Dynamic Host Resolution.'
            );

            expect(loggerMock.warn).toHaveBeenCalledOnceWith(
              'Please review the following error:'
            );
          });
        });
      });

      describe('there is a proper turbineEmbedCode', function () {
        describe('isDynamicEnforced=true', function () {
          beforeEach(function () {
            satelliteMock.container.company.isDynamicEnforced = true;
          });

          it('and the approved hosts list is empty', function () {
            satelliteMock.container.company.cdnAllowList = [];

            expect(function () {
              var createTurbine = injectIndex(
                injectPartialMocks({
                  logger: loggerMock
                })
              );
              createTurbine(satelliteMock);
            }).toThrowError(
              'This library is not authorized for this domain. ' +
                'Please contact your CSM for more information.'
            );

            expect(loggerMock.warn).toHaveBeenCalledOnceWith(
              'Please review the following error:'
            );
          });

          it('and the turbine embed code is not in the list of approved hosts', function () {
            satelliteMock.container.company.cdnAllowList = [
              'first.domain.com',
              'second.domain.com'
            ];

            expect(function () {
              var createTurbine = injectIndex(
                injectPartialMocks({
                  logger: loggerMock
                })
              );
              createTurbine(satelliteMock);
            }).toThrowError(
              'This library is not authorized for this domain. ' +
                'Please contact your CSM for more information.'
            );

            expect(loggerMock.warn).toHaveBeenCalledOnceWith(
              'Please review the following error:'
            );
          });
        });
      });
    });
  });
});
