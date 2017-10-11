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

var isSafariDesktop = /^((?!chrome|android|ipad|iphone).)*safari/i.test(navigator.userAgent);

describe('state', function() {
  var injectState = require('inject-loader!../state');
  var createModuleProvider = require('inject-loader?!../moduleProvider');
  var moduleProvider;
  var createGetSharedModuleExports;
  var createGetExtensionSettings;
  var createPublicRequire;
  var createGetHostedLibFileUrl;
  var state;
  var logger;
  var getDataElementValue;
  var replaceTokens;

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
        hostedLibFilesBaseUrl: '//examples.com/somefolder/',
        settings: {
          'code': 'somecode'
        },
        modules: {
          'example-extension/events/click.js': {
            name: 'click',
            displayName: 'Click',
            script: function(module) {
              module.exports = 'click exports';
            }
          },
          'example-extension/conditions/operatingSystem.js': {
            name: 'operating-system',
            displayName: 'Operating System',
            script: function() {}
          },
          'example-extension/actions/sendBeacon.js': {
            name: 'send-beacon',
            displayName: 'Send Beacon',
            script: function() {}
          },
          'example-extension/dataElements/javascriptVariable.js': {
            name: 'javascript-variable',
            displayName: 'JavaScript Variable',
            script: function() {}
          },
          'example-extension/shared/sharedModule.js': {
            name: 'foo',
            shared: true,
            script: jasmine.createSpy().and.callFake(function(module, require) {
              module.exports = {};
            })
          }
        }
      }
    },
    property: {
      name: 'some name',
      settings: {}
    },
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

    createGetSharedModuleExports = jasmine.createSpy().and.callFake(
      require('../createGetSharedModuleExports')
    );

    createGetExtensionSettings = jasmine.createSpy().and.callFake(
      require('../createGetExtensionSettings')
    );

    createPublicRequire = jasmine.createSpy().and.callFake(
      require('../createPublicRequire')
    );

    createGetHostedLibFileUrl = jasmine.createSpy().and.callFake(
      require('../createGetHostedLibFileUrl')
    );

    getDataElementValue = jasmine.createSpy().and.callFake(
      require('../public/getDataElementValue')
    );

    replaceTokens = jasmine.createSpy().and.callFake(
      require('../public/replaceTokens')
    );

    logger = require('../logger');
    spyOn(logger, 'createPrefixedLogger').and.callThrough();

    state = injectState({
      './moduleProvider': moduleProvider,
      './getLocalStorageItem': require('../getLocalStorageItem'),
      './setLocalStorageItem': require('../setLocalStorageItem'),
      './createGetSharedModuleExports': createGetSharedModuleExports,
      './createGetExtensionSettings': createGetExtensionSettings,
      './createPublicRequire': createPublicRequire,
      './createGetHostedLibFileUrl': createGetHostedLibFileUrl,
      './logger': logger,
      './public/getDataElementValue': getDataElementValue,
      './public/replaceTokens': replaceTokens
    });

    state.init(container);
  });

  it('should hold customVars', function() {
    expect(state.customVars).toEqual({});
  });

  it('should return a module definition', function() {
    var modulePath = 'example-extension/events/click.js';
    expect(state.getModuleDefinition(modulePath)).toEqual({
      name: 'click',
      displayName: 'Click',
      script: jasmine.any(Function)
    });
    expect(moduleProvider.getModuleDefinition).toHaveBeenCalledWith(modulePath);
  });

  it('should return a module\'s exports', function() {
    var modulePath = 'example-extension/events/click.js';
    expect(state.getModuleExports(modulePath)).toBe('click exports');
    expect(moduleProvider.getModuleExports).toHaveBeenCalledWith(modulePath);
  });

  it('should return a module\'s extension name', function() {
    var modulePath = 'example-extension/events/click.js';
    expect(state.getModuleExtensionName(modulePath)).toBe('example-extension');
    expect(moduleProvider.getModuleExtensionName).toHaveBeenCalledWith(modulePath);
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

  // Safari throws an error when setting a local storage item in Private Browser Mode.
  if (!isSafariDesktop) {
    it('getShouldExecuteActions returns false when hide activity local storage key is set',
      function() {
        localStorage.setItem('sdsat_hide_activity', 'true');
        expect(state.getShouldExecuteActions()).toBe(false);
      });

    it('getShouldExecuteActions returns true when hide activity local storage key is not set ' +
      'to true',
    function() {
      localStorage.setItem('sdsat_hide_activity', 'false');
      expect(state.getShouldExecuteActions()).toBe(true);
    });


    it('should enable the debug output', function() {
      state.setDebugOutputEnabled('true');
      expect(state.getDebugOutputEnabled()).toBe(true);
    });
  }

  it('should return cached data element values', function() {
    state.cacheDataElementValue('somekey', 'pageview', 100);
    expect(state.getCachedDataElementValue('somekey', 'pageview'))
      .toBe(100);
  });

  it('should return property settings', function() {
    expect(state.getPropertySettings()).toBe(container.property.settings);
  });

  it('should return the build info', function() {
    expect(state.getBuildInfo()).toBe(container.buildInfo);
  });

  it('creates getSharedModuleExports', function() {
    expect(createGetSharedModuleExports).toHaveBeenCalledWith(
      container.extensions, moduleProvider);
  });

  it('creates getExtensionSettings for each extension', function() {
    expect(createGetExtensionSettings).toHaveBeenCalledWith(
      container.extensions['example-extension'].settings);
  });

  it('creates a prefixed logger for each extension', function() {
    expect(logger.createPrefixedLogger).toHaveBeenCalledWith('Example Extension');
  });

  it('creates createGetHostedLibFileUrl for each extension', function() {
    expect(createGetHostedLibFileUrl).toHaveBeenCalledWith(
      container.extensions['example-extension'].hostedLibFilesBaseUrl);
  });

  it('creates a public require function for each module', function() {
    expect(createPublicRequire.calls.count()).toBe(5);
  });

  it('registers each module', function() {
    expect(moduleProvider.registerModule.calls.count()).toBe(5);
    expect(moduleProvider.registerModule.calls.first().args).toEqual([
      'example-extension/events/click.js',
      { name: 'click', displayName: 'Click', script: jasmine.any(Function) },
      'example-extension',
      jasmine.any(Function),
      {
        buildInfo: container.buildInfo,
        getDataElementValue: getDataElementValue,
        getExtensionSettings: jasmine.any(Function),
        getHostedLibFileUrl: jasmine.any(Function),
        getSharedModule: jasmine.any(Function),
        logger: jasmine.any(Object),
        onPageBottom: jasmine.any(Function),
        propertySettings: container.property.settings,
        replaceTokens: replaceTokens
      }
    ]);
  });

  it('hydrates module provider cache', function() {
    expect(moduleProvider.hydrateCache.calls.count()).toBe(1);
  });
});
