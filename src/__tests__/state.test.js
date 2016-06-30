'use strict';

describe('state', function() {
  var injectState = require('inject!../state');
  var createModuleProvider = require('inject?!../moduleProvider');
  var moduleProvider;
  var createGetSharedModuleExports;
  var createGetExtensionConfigurations;
  var createPublicRequire;
  var state;

  var container = {
    rules: [
      {
        name: 'Example Rule',
        events: [
          {
            modulePath: 'example-extension/events/click.js',
            settings: {}
          }
        ],
        conditions: [
          {
            modulePath: 'example-extension/conditions/operatingSystem.js',
            settings: {}
          }
        ],
        actions: [
          {
            modulePath: 'example-extension/actions/sendBeacon.js',
            settings: {}
          }
        ]
      }
    ],
    dataElements: {
      myDataElement: {
        modulePath: 'example-extension/dataElements/javascriptVariable.js',
        settings: {}
      }
    },
    extensions: {
      'example-extension': {
        displayName: 'Example Extension',
        configurations: {
          ECa: {
            settings: {
              'code': 'somecode'
            }
          }
        },
        modules: {
          'example-extension/events/click.js': {
            displayName: 'Click',
            script: function(module) {
              module.exports = 'click exports';
            }
          },
          'example-extension/conditions/operatingSystem.js': {
            displayName: 'Operating System',
            script: function() {}
          },
          'example-extension/actions/sendBeacon.js': {
            displayName: 'Send Beacon',
            script: function() {}
          },
          'example-extension/dataElements/javascriptVariable.js': {
            displayName: 'JavaScript Variable',
            script: function() {}
          },
          'example-extension/shared/sharedModule.js': {
            sharedName: 'foo',
            script: jasmine.createSpy().and.callFake(function(module, require) {
              module.exports = {};
            })
          }
        }
      }
    },
    propertySettings: {},
    buildInfo: {
      appVersion: '6BE',
      buildDate: '2016-03-30 16:27:10 UTC',
      publishDate: '2016-03-30 16:27:10 UTC',
      environment: 'dev'
    }
  };

  beforeEach(function() {
    moduleProvider = createModuleProvider();
    
    Object.keys(moduleProvider).forEach(function(methodName) {
      spyOn(moduleProvider, methodName).and.callThrough();
    });

    createGetSharedModuleExports = jasmine.createSpy().and.callThrough(
      require('../createGetSharedModuleExports'));

    createGetExtensionConfigurations = jasmine.createSpy().and.callThrough(
      require('../createGetExtensionConfigurations'));

    createPublicRequire = jasmine.createSpy().and.callThrough(
      require('../createPublicRequire'));

    state = injectState({
      './moduleProvider': moduleProvider,
      './getLocalStorageItem': require('../getLocalStorageItem'),
      './setLocalStorageItem': require('../setLocalStorageItem'),
      './createGetSharedModuleExports': createGetSharedModuleExports,
      './createGetExtensionConfigurations': createGetExtensionConfigurations,
      './createPublicRequire': createPublicRequire
    });

    state.init(container);
  });

  it('should hold customVars', function() {
    expect(state.customVars).toEqual({});
  });

  it('should return a module display name', function() {
    var modulePath = 'example-extension/events/click.js';
    expect(state.getModuleDisplayName(modulePath)).toBe('Click');
    expect(moduleProvider.getModuleDisplayName).toHaveBeenCalledWith(modulePath);
  });

  it('should return a module\'s exports', function() {
    var modulePath = 'example-extension/events/click.js';
    expect(state.getModuleExports(modulePath)).toBe('click exports');
    expect(moduleProvider.getModuleExports).toHaveBeenCalledWith(modulePath);
  });

  it('should return rules', function() {
    expect(state.getRules()).toBe(container.rules);
  });

  it('should get a data element definition', function() {
    expect(state.getDataElementDefinition('myDataElement')).toEqual({
      modulePath: 'example-extension/dataElements/javascriptVariable.js',
      settings: {}
    });
  });

  it('getShouldExecuteActions returns false when hide activity local storage key is set',
    function() {
      localStorage.setItem('sdsat_hide_activity', 'true');
      expect(state.getShouldExecuteActions()).toBe(false);
    });

  it('getShouldExecuteActions returns true when hide activity local storage key is not set to true',
    function() {
      localStorage.setItem('sdsat_hide_activity', 'false');
      expect(state.getShouldExecuteActions()).toBe(true);
    });

  it('should enable the debug output', function() {
    state.setDebugOutputEnabled('true');
    expect(state.getDebugOutputEnabled()).toBe(true);
  });

  it('should return cached data element values', function() {
    state.cacheDataElementValue('somekey', 'pageview', 100);
    expect(state.getCachedDataElementValue('somekey', 'pageview'))
      .toBe(100);
  });

  it('should return property settings', function() {
    expect(state.getPropertySettings()).toBe(container.propertySettings);
  });

  it('should return the build info', function() {
    expect(state.getBuildInfo()).toBe(container.buildInfo);
  });

  it('creates getSharedModuleExports', function() {
    expect(createGetSharedModuleExports).toHaveBeenCalledWith(
      container.extensions, moduleProvider);
  });

  it('creates getExtensionConfigurations for each extension', function() {
    expect(createGetExtensionConfigurations).toHaveBeenCalledWith(
      container.extensions['example-extension'].configurations);
  });

  it('creates a public require function for each module', function() {
    expect(createPublicRequire.calls.count()).toBe(5);
  });

  it('registers each module', function() {
    expect(moduleProvider.registerModule.calls.count()).toBe(5);
  });

  it('hydrates module provider cache', function() {
    expect(moduleProvider.hydrateCache.calls.count()).toBe(1);
  });
});
