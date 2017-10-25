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

describe('index', function() {
  var index;

  var getInjectedIndex = function(mocks) {
    return require('inject-loader!../index')(mocks);
  };

  beforeEach(function() {
    window._satellite = {
      container: {
        property: {
          settings: {
            undefinedVarsReturnEmpty: true
          }
        }
      }
    };
  });

  afterEach(function() {
    delete window._satellite;
  });

  it('exports the window._satellite object', function() {
    var index = getInjectedIndex();
    expect(index).toBe(window._satellite);
  });

  it('deletes the container', function() {
    getInjectedIndex();
    expect(window._satellite.container).toBe(undefined);
  });

  it('creates moduleProvider', function() {
    var createModuleProvider = jasmine.createSpy();
    getInjectedIndex({
      './createModuleProvider': createModuleProvider
    });

    expect(createModuleProvider).toHaveBeenCalled();
  });

  it('creates getDataElementValue', function() {
    var createGetDataElementValue = jasmine.createSpy();
    var moduleProvider = function() {};
    getInjectedIndex({
      './createGetDataElementValue': createGetDataElementValue,
      './createModuleProvider': function() { return moduleProvider; }
    });

    expect(createGetDataElementValue).toHaveBeenCalledWith(
      moduleProvider,
      jasmine.any(Function),
      true
    );
  });

  it('creates setCustomVar', function() {
    var createSetCustomVar = jasmine.createSpy();
    getInjectedIndex({
      './createSetCustomVar': createSetCustomVar
    });

    expect(createSetCustomVar).toHaveBeenCalledWith(
      jasmine.any(Object)
    );
  });

  it('creates isVar', function() {
    var createIsVar = jasmine.createSpy();
    getInjectedIndex({
      './createIsVar': createIsVar
    });

    expect(createIsVar).toHaveBeenCalledWith(
      jasmine.any(Object),
      jasmine.any(Function)
    );
  });

  it('creates getVar', function() {
    var createGetVar = jasmine.createSpy();
    var getDataElementValue = function() {};
    getInjectedIndex({
      './createGetVar': createGetVar,
      './createGetDataElementValue': function() { return getDataElementValue; }
    });

    expect(createGetVar).toHaveBeenCalledWith(
      jasmine.any(Object),
      jasmine.any(Function),
      getDataElementValue
    );
  });

  it('creates replaceTokens', function() {
    var createReplaceTokens = jasmine.createSpy();
    var isVar = function() {};
    var getVar = function() {};
    getInjectedIndex({
      './createReplaceTokens': createReplaceTokens,
      './createIsVar': function() { return isVar; },
      './createGetVar': function() { return getVar; }
    });

    expect(createReplaceTokens).toHaveBeenCalledWith(
      isVar,
      getVar,
      true
    );
  });

  it('sets logger output enabled when local storage item is \'true\'', function() {
    var logger = {};
    var localStorage = {
      getItem: jasmine.createSpy().and.returnValue('true')
    };
    getInjectedIndex({
      './localStorage': localStorage,
      './logger': logger
    });

    expect(localStorage.getItem).toHaveBeenCalledWith('sdsat_debug');
    expect(logger.outputEnabled).toBe(true);
  });


  it('sets logger output enabled when local storage item is anything ' +
    'other than \'true\'', function() {
    var logger = {};
    var localStorage = {
      getItem: jasmine.createSpy()
    };
    getInjectedIndex({
      './localStorage': localStorage,
      './logger': logger
    });

    expect(localStorage.getItem).toHaveBeenCalledWith('sdsat_debug');
    expect(logger.outputEnabled).toBe(false);
  });

  it('hydrates satellite object', function() {
    var container = window._satellite.container;
    var hydrateSatelliteObject = jasmine.createSpy();
    var getVar = function() {};
    var setCustomVar = function() {};
    getInjectedIndex({
      './hydrateSatelliteObject': hydrateSatelliteObject,
      './createGetVar': function() { return getVar; },
      './createSetCustomVar': function() { return setCustomVar; }
    });

    expect(hydrateSatelliteObject).toHaveBeenCalledWith(
      window._satellite,
      container,
      jasmine.any(Function),
      getVar,
      setCustomVar
    );
  });

  it('hydrates module provider', function() {
    var container = window._satellite.container;
    var hydrateModuleProvider = jasmine.createSpy();
    var moduleProvider = {};
    var replaceTokens = function() {};
    var getDataElementValue = function() {};
    getInjectedIndex({
      './hydrateModuleProvider': hydrateModuleProvider,
      './createModuleProvider': function() { return moduleProvider; },
      './createReplaceTokens': function() { return replaceTokens; },
      './createGetDataElementValue': function() { return getDataElementValue; }
    });

    expect(hydrateModuleProvider).toHaveBeenCalledWith(
      container,
      moduleProvider,
      replaceTokens,
      getDataElementValue
    );
  });

  it('initializes rules', function() {
    var rules = [];
    window._satellite.container.rules = rules;
    var initRules = jasmine.createSpy();
    var moduleProvider = {};
    var replaceTokens = function() {};
    getInjectedIndex({
      './initRules': initRules,
      './createModuleProvider': function() { return moduleProvider; },
      './createReplaceTokens': function() { return replaceTokens; }
    });

    expect(initRules).toHaveBeenCalledWith(
      rules,
      moduleProvider,
      replaceTokens,
      jasmine.any(Function)
    );
  });

  it('provides an empty array for rules when container doesn\'t have rules', function() {
    delete window._satellite.container.rules;
    var rules;
    getInjectedIndex({
      './initRules': function(_rules) {
        rules = _rules;
      }
    });

    expect(rules).toEqual([]);
  });

  describe('getDataElementDefinition', function() {
    it('returns data elements from container', function() {
      var dataElementDefinition = {};
      window._satellite.container.dataElements = {
        'foo': dataElementDefinition
      };
      var getDataElementDefinition;
      getInjectedIndex({
        './createIsVar': function(customVars, _getDataElementDefinition) {
          getDataElementDefinition = _getDataElementDefinition;
          return function() {};
        }
      });

      expect(getDataElementDefinition('foo')).toBe(dataElementDefinition);
    });

    it('doesn\'t throw an error when container doesn\'t have data elements', function() {
      delete window._satellite.container.dataElements;
      var getDataElementDefinition;
      getInjectedIndex({
        './createIsVar': function(customVars, _getDataElementDefinition) {
          getDataElementDefinition = _getDataElementDefinition;
          return function() {};
        }
      });

      expect(getDataElementDefinition('foo')).toBe(undefined);
    });
  });

  describe('setDebugOutputEnabled', function() {
    it('sets localStorage item', function() {
      var setOutputDebugEnabled;
      var localStorage = {
        getItem: function() {},
        setItem: jasmine.createSpy()
      };
      getInjectedIndex({
        './hydrateSatelliteObject': function(_satellite, container, _setOutputDebugEnabled) {
          setOutputDebugEnabled = _setOutputDebugEnabled;
        },
        './localStorage': localStorage
      });

      setOutputDebugEnabled(true);

      expect(localStorage.setItem).toHaveBeenCalledWith('sdsat_debug', true);
    });
  });

  describe('getShouldExecuteActions', function() {
    it('returns false if local storage item\'s value is \'true\'', function() {
      var getShouldExecuteActions;
      var localStorage = {
        getItem: jasmine.createSpy().and.returnValue('true')
      };
      getInjectedIndex({
        './initRules': function(rules, moduleProvider, replaceTokens, _getShouldExecuteActions) {
          getShouldExecuteActions = _getShouldExecuteActions;
        },
        './localStorage': localStorage
      });

      var shouldExecuteActions = getShouldExecuteActions();

      expect(localStorage.getItem).toHaveBeenCalledWith('sdsat_hide_activity');
      expect(shouldExecuteActions).toBe(false);
    });

    it('returns true if local storage item\'s value is anything other than \'true\'', function() {
      var getShouldExecuteActions;
      var localStorage = {
        getItem: jasmine.createSpy().and.returnValue()
      };
      getInjectedIndex({
        './initRules': function(rules, moduleProvider, replaceTokens, _getShouldExecuteActions) {
          getShouldExecuteActions = _getShouldExecuteActions;
        },
        './localStorage': localStorage
      });

      var shouldExecuteActions = getShouldExecuteActions();

      expect(localStorage.getItem).toHaveBeenCalledWith('sdsat_hide_activity');
      expect(shouldExecuteActions).toBe(true);
    });
  });
});
