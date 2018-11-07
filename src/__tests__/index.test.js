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

describe('index', function() {
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
    delete window.__satelliteLoaded;
    window.localStorage.removeItem('com.adobe.reactor.debug');
    window.localStorage.removeItem('com.adobe.reactor.hideActivity');
  });

  it('exports the window._satellite object', function() {
    var index = injectIndex();
    expect(index).toBe(window._satellite);
  });

  it('prevents turbine from executing multiple times', function() {
    var createModuleProvider = jasmine.createSpy();

    injectIndex();
    injectIndex({
      './createModuleProvider': createModuleProvider
    });

    expect(createModuleProvider).not.toHaveBeenCalled();
  });

  it('deletes the container', function() {
    injectIndex();
    expect(window._satellite.container).toBe(undefined);
  });

  it('migrates cookie data', function() {
    var migrateCookieDataSpy = jasmine.createSpy();

    var dataElements = {
      foo: {
        modulePath: 'core/foo.js',
        storageDuration: 'visitor'
      }
    };

    window._satellite.container.dataElements = dataElements;

    injectIndex({
      './dataElementSafe': {
        migrateCookieData: migrateCookieDataSpy
      }
    });

    expect(migrateCookieDataSpy).toHaveBeenCalledWith(dataElements);
  });

  it('creates moduleProvider', function() {
    var createModuleProvider = jasmine.createSpy();
    injectIndex({
      './createModuleProvider': createModuleProvider
    });

    expect(createModuleProvider).toHaveBeenCalled();
  });

  it('creates getDataElementValue', function() {
    var createGetDataElementValue = jasmine.createSpy();
    var moduleProvider = function() {};
    injectIndex({
      './createGetDataElementValue': createGetDataElementValue,
      './createModuleProvider': function() { return moduleProvider; }
    });

    expect(createGetDataElementValue).toHaveBeenCalledWith(
      moduleProvider,
      jasmine.any(Function),
      jasmine.any(Function),
      true
    );
  });

  it('creates setCustomVar', function() {
    var createSetCustomVar = jasmine.createSpy();
    injectIndex({
      './createSetCustomVar': createSetCustomVar
    });

    expect(createSetCustomVar).toHaveBeenCalledWith(
      jasmine.any(Object)
    );
  });

  it('creates isVar', function() {
    var createIsVar = jasmine.createSpy();
    injectIndex({
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
    injectIndex({
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
    injectIndex({
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
    window.localStorage.setItem('com.adobe.reactor.debug', true);

    injectIndex({
      './logger': logger
    });

    expect(logger.outputEnabled).toBe(true);
  });

  it('sets logger output disabled when local storage item is anything ' +
    'other than \'true\'', function() {
    var logger = {};
    window.localStorage.setItem('com.adobe.reactor.debug', false);

    injectIndex({
      './logger': logger
    });

    expect(logger.outputEnabled).toBe(false);
  });

  it('hydrates satellite object', function() {
    var container = window._satellite.container;
    var hydrateSatelliteObject = jasmine.createSpy();
    var getVar = function() {};
    var setCustomVar = function() {};
    injectIndex({
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
    injectIndex({
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
    injectIndex({
      './initRules': initRules,
      './createModuleProvider': function() { return moduleProvider; },
      './createReplaceTokens': function() { return replaceTokens; }
    });

    expect(initRules).toHaveBeenCalledWith(
      window._satellite,
      rules,
      moduleProvider,
      replaceTokens
    );
  });

  it('provides an empty array for rules when container doesn\'t have rules', function() {
    delete window._satellite.container.rules;
    var rules;
    injectIndex({
      './initRules': function(_satellite, _rules) {
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
      injectIndex({
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
      injectIndex({
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
      injectIndex({
        './hydrateSatelliteObject': function(_satellite, container, _setOutputDebugEnabled) {
          setOutputDebugEnabled = _setOutputDebugEnabled;
        }
      });

      setOutputDebugEnabled(true);

      expect(window.localStorage.getItem('com.adobe.reactor.debug')).toBe('true');
    });
  });
});
