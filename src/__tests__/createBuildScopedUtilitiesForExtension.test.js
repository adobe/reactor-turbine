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

var createBuildScopedUtilitiesForExtensionTest = require('../createBuildScopedUtilitiesForExtension');

describe('createBuildScopedUtilitiesForExtension returns a function that when called', function () {
  it('builds and returns utilities', function () {
    var replaceTokens = function () {};
    var getDataElementValue = function () {};
    var container = {
      buildInfo: {
        version: '1.0.0',
        minified: true
      },
      property: {
        settings: {
          domains: ['example.com']
        }
      },
      extensions: {
        core: {
          displayName: 'Core',
          settings: {
            foo: 'core'
          },
          hostedLibFilesBaseUrl: 'https://core'
        }
      }
    };

    var prefixedLogger = {
      // "type" here is just to distinguish it when we do a toEqual check.
      type: 'prefixedLogger'
    };
    var createPrefixedLogger = jasmine
      .createSpy()
      .and.returnValue(prefixedLogger);

    var getExtensionSettings = function () {};
    var createGetExtensionSettings = jasmine
      .createSpy()
      .and.returnValue(getExtensionSettings);

    var getHostedLibFileUrl = function () {};
    var createGetHostedLibFileUrl = jasmine
      .createSpy()
      .and.returnValue(getHostedLibFileUrl);

    var buildScopedUtilitiesForExtension = createBuildScopedUtilitiesForExtensionTest(
      container,
      createPrefixedLogger,
      createGetExtensionSettings,
      createGetHostedLibFileUrl,
      replaceTokens,
      getDataElementValue
    );

    var utilities = buildScopedUtilitiesForExtension('core');

    expect(createPrefixedLogger).toHaveBeenCalledWith('Core');
    expect(createGetExtensionSettings).toHaveBeenCalledWith(
      replaceTokens,
      container.extensions.core.settings
    );
    expect(createGetHostedLibFileUrl).toHaveBeenCalledWith(
      container.extensions.core.hostedLibFilesBaseUrl,
      true
    );

    expect(utilities).toEqual({
      buildInfo: container.buildInfo,
      getDataElementValue: getDataElementValue,
      getExtensionSettings: getExtensionSettings,
      getHostedLibFileUrl: getHostedLibFileUrl,
      logger: prefixedLogger,
      propertySettings: container.property.settings,
      replaceTokens: replaceTokens
    });
  });
});
