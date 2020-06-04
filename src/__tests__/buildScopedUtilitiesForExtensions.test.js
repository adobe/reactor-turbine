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

var buildScopedUtilitiesForExtensionsTest = require('../buildScopedUtilitiesForExtensions');

describe('buildScopedUtilitiesForExtensions', function () {
  it('builds utilities scoped by extension name', function () {
    var container = {
      extensions: {
        core: {
          displayName: 'Core'
        },
        analytics: {
          displayName: 'Analytics'
        }
      }
    };

    var scopedUtilitiesForExtensions = {
      core: {
        getExtensionSettings: function () {}
      },
      analytics: {
        getExtensionSettings: function () {}
      }
    };

    var buildScopedUtilitiesForExtension = jasmine
      .createSpy()
      .and.callFake(function (extensionName) {
        return scopedUtilitiesForExtensions[extensionName];
      });

    expect(
      buildScopedUtilitiesForExtensionsTest(
        container,
        buildScopedUtilitiesForExtension
      )
    ).toEqual(scopedUtilitiesForExtensions);
  });
});
