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

var injectIndex = require('inject-loader!../index');

describe('index', function () {
  var container;
  var modules;

  beforeEach(function () {
    container = {
      property: {
        settings: {
          undefinedVarsReturnEmpty: true,
          ruleComponentSequencingEnabled: false
        }
      }
    };

    modules = {
      'core::events::click': {
        getExports: function () {}
      }
    };
  });

  afterEach(function () {
    delete window._satellite;
    delete window.__satelliteLoaded;
    window.localStorage.clear();
  });

  it('prevents turbine from executing multiple times', function () {
    var moduleProvider = jasmine.createSpyObj('moduleProvider', [
      'registerModules'
    ]);

    injectIndex().initialize(container, modules);
    injectIndex({
      './moduleProvider': moduleProvider
    }).initialize(container, modules);

    expect(moduleProvider.registerModules).not.toHaveBeenCalled();
  });

  it('registers modules with module provider', function () {
    var moduleProvider = jasmine.createSpyObj('moduleProvider', [
      'registerModules'
    ]);
    injectIndex({
      './moduleProvider': moduleProvider
    }).initialize(container, modules);

    expect(moduleProvider.registerModules).toHaveBeenCalledWith(modules);
  });

  it('migrates cookie data', function () {
    var migrateCookieDataSpy = jasmine.createSpy();

    var dataElements = {
      foo: {
        modulePath: 'core/foo.js',
        storageDuration: 'visitor'
      }
    };

    container.dataElements = dataElements;

    injectIndex({
      './dataElementSafe': {
        migrateCookieData: migrateCookieDataSpy
      }
    }).initialize(container, modules);

    expect(migrateCookieDataSpy).toHaveBeenCalledWith(dataElements);
  });

  it('creates getDataElementValue', function () {
    var createGetDataElementValue = jasmine.createSpy();
    var moduleProvider = { registerModules: function () {} };

    injectIndex({
      './createGetDataElementValue': createGetDataElementValue,
      './moduleProvider': moduleProvider
    }).initialize(container, modules);

    expect(createGetDataElementValue).toHaveBeenCalledWith(
      moduleProvider,
      jasmine.any(Function),
      jasmine.any(Function),
      container.property.settings.undefinedVarsReturnEmpty
    );
  });

  it('creates setCustomVar', function () {
    var createSetCustomVar = jasmine.createSpy();
    injectIndex({
      './createSetCustomVar': createSetCustomVar
    }).initialize(container, modules);

    expect(createSetCustomVar).toHaveBeenCalledWith(jasmine.any(Object));
  });

  it('creates isVar', function () {
    var createIsVar = jasmine.createSpy();
    injectIndex({
      './createIsVar': createIsVar
    }).initialize(container, modules);

    expect(createIsVar).toHaveBeenCalledWith(
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('creates getVar', function () {
    var createGetVar = jasmine.createSpy();
    var getDataElementValue = function () {};
    injectIndex({
      './createGetVar': createGetVar,
      './createGetDataElementValue': function () {
        return getDataElementValue;
      }
    }).initialize(container, modules);

    expect(createGetVar).toHaveBeenCalledWith(
      jasmine.any(Object),
      jasmine.any(Function),
      getDataElementValue
    );
  });

  it('creates replaceTokens', function () {
    var createReplaceTokens = jasmine.createSpy();
    var isVar = function () {};
    var getVar = function () {};
    injectIndex({
      './createReplaceTokens': createReplaceTokens,
      './createIsVar': function () {
        return isVar;
      },
      './createGetVar': function () {
        return getVar;
      }
    }).initialize(container, modules);

    expect(createReplaceTokens).toHaveBeenCalledWith(
      isVar,
      getVar,
      container.property.settings.undefinedVarsReturnEmpty
    );
  });

  it('creates namespaced storage', function () {
    var getNamespacedStorage = jasmine.createSpy().and.returnValue({
      getItem: function () {}
    });
    injectIndex({
      './getNamespacedStorage': getNamespacedStorage
    }).initialize(container, modules);

    expect(getNamespacedStorage).toHaveBeenCalledWith('localStorage');
  });

  it('creates debug controller', function () {
    var logger = { type: 'logger' };
    var createDebugController = jasmine.createSpy().and.returnValue({
      setDebugEnabled: function () {}
    });

    injectIndex({
      './createDebugController': createDebugController,
      './logger': logger
    }).initialize(container, modules);

    expect(createDebugController).toHaveBeenCalledWith(
      jasmine.any(Object),
      logger
    );
  });

  it('hydrates satellite object', function () {
    var hydrateSatelliteObject = jasmine.createSpy();
    var getVar = function () {};
    var setCustomVar = function () {};
    injectIndex({
      './hydrateSatelliteObject': hydrateSatelliteObject,
      './createGetVar': function () {
        return getVar;
      },
      './createSetCustomVar': function () {
        return setCustomVar;
      }
    }).initialize(container, modules);

    expect(hydrateSatelliteObject).toHaveBeenCalledWith(
      window._satellite,
      container,
      jasmine.any(Function),
      getVar,
      setCustomVar
    );
  });

  it('builds scoped utilities for extensions', function () {
    var logger = { createPrefixedLogger: function () {} };
    var createGetExtensionSettings = function () {};
    var createGetHostedLibFileUrl = function () {};
    var buildScopedUtilitiesForExtension = jasmine.createSpy();
    var createBuildScopedUtilitiesForExtension = jasmine
      .createSpy()
      .and.returnValue(buildScopedUtilitiesForExtension);
    var buildScopedUtilitiesForExtensions = jasmine.createSpy();
    injectIndex({
      './logger': logger,
      './createGetExtensionSettings': createGetExtensionSettings,
      './createGetHostedLibFileUrl': createGetHostedLibFileUrl,
      './createBuildScopedUtilitiesForExtension': createBuildScopedUtilitiesForExtension,
      './buildScopedUtilitiesForExtensions': buildScopedUtilitiesForExtensions
    }).initialize(container, modules);

    expect(createBuildScopedUtilitiesForExtension).toHaveBeenCalledWith(
      container,
      logger.createPrefixedLogger,
      createGetExtensionSettings,
      createGetHostedLibFileUrl,
      jasmine.any(Function),
      jasmine.any(Function)
    );
    expect(buildScopedUtilitiesForExtensions).toHaveBeenCalledWith(
      container,
      buildScopedUtilitiesForExtension
    );
  });

  it('registers modules with module provider', function () {
    var moduleProvider = jasmine.createSpyObj('moduleProvider', [
      'registerModules'
    ]);
    injectIndex({
      './moduleProvider': moduleProvider
    }).initialize(container, modules);

    expect(moduleProvider.registerModules).toHaveBeenCalledWith(modules);
  });

  it('initializes rules', function () {
    var rules = [];
    var initRules = jasmine.createSpy();
    var buildRuleExecutionOrder = function () {};
    var createInitEventModule = function () {};
    injectIndex({
      './rules/initRules': initRules,
      './buildRuleExecutionOrder': buildRuleExecutionOrder,
      './rules/createInitEventModule': function () {
        return createInitEventModule;
      }
    }).initialize(container, modules);;

    expect(initRules).toHaveBeenCalledWith(
      buildRuleExecutionOrder,
      rules,
      createInitEventModule
    );
  });

  it("provides an empty array for rules when container doesn't have rules", function () {
    var rules;
    injectIndex({
      './rules/initRules': function (_satellite, _rules) {
        rules = _rules;
      }
    }).initialize(container, modules);

    expect(rules).toEqual([]);
  });

  describe('getDataElementDefinition', function () {
    it('returns data elements from container', function () {
      var dataElementDefinition = {};
      container.dataElements = {
        foo: dataElementDefinition
      };
      var getDataElementDefinition;
      injectIndex({
        './createIsVar': function (customVars, _getDataElementDefinition) {
          getDataElementDefinition = _getDataElementDefinition;
          return function () {};
        }
      }).initialize(container, modules);

      expect(getDataElementDefinition('foo')).toBe(dataElementDefinition);
    });

    it("doesn't throw an error when container doesn't have data elements", function () {
      var getDataElementDefinition;
      injectIndex({
        './createIsVar': function (customVars, _getDataElementDefinition) {
          getDataElementDefinition = _getDataElementDefinition;
          return function () {};
        }
      }).initialize(container, modules);

      expect(getDataElementDefinition('foo')).toBe(undefined);
    });
  });

  describe('setDebugOutputEnabled', function () {
    it('sets localStorage item', function () {
      var setOutputDebugEnabled;
      injectIndex({
        './hydrateSatelliteObject': function (
          _satellite,
          container,
          _setOutputDebugEnabled
        ) {
          setOutputDebugEnabled = _setOutputDebugEnabled;
        }
      }).initialize(container, modules);

      setOutputDebugEnabled(true);

      expect(window.localStorage.getItem('com.adobe.reactor.debug')).toBe(
        'true'
      );
    });
  });
});
