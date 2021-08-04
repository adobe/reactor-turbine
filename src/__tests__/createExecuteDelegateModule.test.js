/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

'use strict';

var createExecuteDelegateModule = require('../createExecuteDelegateModule');
var createSettingsFileTransformer = require('../createSettingsFileTransformer');
var decorateWithDynamicHostFake;
var emptyFn = function () {};
var event = { $type: 'type' };
var moduleDescriptor;
var moduleCallParameters = ['a', 'b'];

describe('createExecuteDelegateModule returns a function that when called', function () {
  beforeEach(function () {
    moduleDescriptor = { modulePath: 'path', settings: { key: 'value' } };
    decorateWithDynamicHostFake = function (url) {
      return 'https://assets.adobedtm.com' + url;
    };
  });

  it('returns the module export function result', function () {
    var moduleExportsSpy = jasmine
      .createSpy('moduleExports')
      .and.returnValue('module result');
    var getModuleExportsSpy = jasmine
      .createSpy('getModuleExports')
      .and.returnValue(moduleExportsSpy);

    var moduleProvider = {
      getModuleExports: getModuleExportsSpy,
      getModuleDefinition: jasmine.createSpy().and.returnValue({})
    };
    var replaceTokens = emptyFn;
    var settingsFileTransformer = emptyFn;

    expect(
      createExecuteDelegateModule(
        moduleProvider,
        replaceTokens,
        settingsFileTransformer
      )(moduleDescriptor, event, moduleCallParameters)
    ).toBe('module result');
    expect(getModuleExportsSpy).toHaveBeenCalledWith('path');
    expect(moduleExportsSpy).toHaveBeenCalledWith(undefined, 'a', 'b');
  });

  it(
    'calls the module export function with an empty array when ' +
      ' module call parameters are not provided',
    function () {
      var moduleExportsSpy = jasmine.createSpy('moduleExports');

      var moduleProvider = {
        getModuleExports: function () {
          return moduleExportsSpy;
        },
        getModuleDefinition: jasmine.createSpy().and.returnValue({})
      };
      var replaceTokens = emptyFn;
      var settingsFileTransformer = emptyFn;

      createExecuteDelegateModule(
        moduleProvider,
        replaceTokens,
        settingsFileTransformer
      )(moduleDescriptor, event);

      expect(moduleExportsSpy).toHaveBeenCalledWith(undefined);
    }
  );

  it('The moduleDescriptor.settings is only handed to settingsFileTransformer once', function () {
    var moduleExportsSpy = jasmine.createSpy('moduleExports');
    var settingsFileTransformer = createSettingsFileTransformer(
      true,
      decorateWithDynamicHostFake
    );

    var settingsFileTransformerSpy = jasmine
      .createSpy('settingsFileTransform')
      .and.callFake(settingsFileTransformer);

    var moduleProvider = {
      getModuleExports: function () {
        return moduleExportsSpy;
      },
      getModuleDefinition: jasmine.createSpy().and.returnValue({
        filePaths: ['someUrl', 'a.b.someUrl', 'someList[].someUrl']
      })
    };
    var replaceTokens = emptyFn;

    var executeDelegateModule = createExecuteDelegateModule(
      moduleProvider,
      replaceTokens,
      settingsFileTransformerSpy
    );

    moduleDescriptor.modulePath = 'someModule/folder/lib.js';
    moduleDescriptor.settings = {
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
    };

    /** --- yes, really call this twice --- **/
    executeDelegateModule(moduleDescriptor);
    expect(moduleDescriptor.hasDynamicTransform).toBeTrue();
    executeDelegateModule(moduleDescriptor);
    expect(moduleDescriptor.hasDynamicTransform).toBeTrue();
    /** ---           ---             --- **/

    // the customer added some keys later after some transformation
    moduleDescriptor.settings.addedByCustomer = {
      someKey: 'is-still-here'
    };
    moduleDescriptor.settings.alsoAddedByCustomer = 'is-string-still-here';
    executeDelegateModule(moduleDescriptor);
    expect(moduleDescriptor.hasDynamicTransform).toBeTrue();

    expect(moduleDescriptor.settings).toEqual({
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
      someList: [{ someUrl: 'https://assets.adobedtm.com/some/relative/url' }],
      addedByCustomer: {
        someKey: 'is-still-here'
      },
      alsoAddedByCustomer: 'is-string-still-here'
    });
    expect(settingsFileTransformerSpy).toHaveBeenCalledTimes(1);
  });

  it('throws an error if the module export is not a function', function () {
    var moduleProvider = {
      getModuleExports: function () {
        return 5;
      },
      getModuleDefinition: jasmine.createSpy().and.returnValue({})
    };
    var replaceTokens = emptyFn;
    var settingsFileTransformer = emptyFn;

    expect(function () {
      createExecuteDelegateModule(
        moduleProvider,
        replaceTokens,
        settingsFileTransformer()
      )(moduleDescriptor, event, moduleCallParameters);
    }).toThrow(new Error('Module did not export a function.'));
  });

  it('calls the module export function with settings having the tokens replaced', function () {
    var settings;
    var moduleExportsSpy = jasmine
      .createSpy('moduleExports')
      .and.callFake(function (s) {
        settings = s;
      });

    var moduleDefinition = {
      filePaths: ['someKey']
    };
    var moduleProvider = {
      getModuleExports: function () {
        return moduleExportsSpy;
      },
      getModuleDefinition: jasmine.createSpy().and.returnValue(moduleDefinition)
    };
    var replaceTokens = function () {
      return { key: 'replaced tokens value' };
    };

    var settingsFileTransformerSpy = jasmine
      .createSpy('settingsFileTransformer')
      .and.returnValue(moduleDescriptor.settings);

    createExecuteDelegateModule(
      moduleProvider,
      replaceTokens,
      settingsFileTransformerSpy
    )(moduleDescriptor, event, moduleCallParameters);

    expect(settings).toEqual({
      key: 'replaced tokens value'
    });

    expect(settingsFileTransformerSpy).toHaveBeenCalledWith(
      moduleDescriptor.settings,
      moduleDefinition.filePaths,
      moduleDescriptor.modulePath
    );
  });

  it(
    'calls replaceTokens with an empty settings object if not' +
      ' present on the moduleDescriptor',
    function () {
      var replaceTokensSpy = jasmine.createSpy('replaceTokens');
      var moduleDescriptor = { modulePath: 'path' };
      var moduleProvider = {
        getModuleExports: function () {
          return emptyFn;
        },
        getModuleDefinition: jasmine.createSpy().and.returnValue({})
      };

      // descriptor has no settings, so the code is creating an empty object to
      // pass here, which we will reflect back.
      var settingsFileTransformer = jasmine
        .createSpy()
        .and.callFake(function (settings) {
          return settings;
        });

      createExecuteDelegateModule(
        moduleProvider,
        replaceTokensSpy,
        settingsFileTransformer
      )(moduleDescriptor, event, moduleCallParameters);

      expect(replaceTokensSpy).toHaveBeenCalledWith({}, event);
    }
  );

  describe('the function moduleProvider.decorateSettingsWithDelegateFilePaths', function () {
    it('is handed the settings to decorate, the filePaths, and the modulePath', function () {
      var replaceTokens = function () {};
      var moduleDescriptor = {
        modulePath: 'module path',
        settings: {
          someUrl: 'https://test.com'
        }
      };
      var moduleProvider = {
        getModuleExports: function () {
          return emptyFn;
        },
        getModuleDefinition: jasmine.createSpy().and.returnValue({
          filePaths: ['source']
        })
      };

      var settingsFileTransformerSpy = jasmine.createSpy(
        'settingsFileTransformer'
      );

      createExecuteDelegateModule(
        moduleProvider,
        replaceTokens,
        settingsFileTransformerSpy
      )(moduleDescriptor, event, moduleCallParameters);

      expect(settingsFileTransformerSpy).toHaveBeenCalledWith(
        moduleDescriptor.settings,
        ['source'],
        moduleDescriptor.modulePath
      );
    });

    it(
      'is called with an empty settings object if moduleDescriptor.settings ' +
        ' is missing',
      function () {
        var replaceTokens = function () {};
        var moduleDescriptor = {
          modulePath: 'module path'
        };
        var moduleProvider = {
          getModuleExports: function () {
            return emptyFn;
          },
          getModuleDefinition: jasmine.createSpy().and.returnValue({})
        };

        var settingsFileTransformerSpy = jasmine.createSpy(
          'settingsFileTransformer'
        );

        createExecuteDelegateModule(
          moduleProvider,
          replaceTokens,
          settingsFileTransformerSpy
        )(moduleDescriptor, event, moduleCallParameters);

        expect(settingsFileTransformerSpy).toHaveBeenCalledWith(
          {},
          [],
          moduleDescriptor.modulePath
        );
      }
    );
  });
});
