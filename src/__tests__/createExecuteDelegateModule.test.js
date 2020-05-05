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
var emptyFn = function () {};
var event = { $type: 'type' };
var moduleDescriptor = { modulePath: 'path', settings: { key: 'value' } };
var moduleCallParameters = ['a', 'b'];

describe('createExecuteDelegateModule returns a function that when called', function () {
  it('returns the module export function result', function () {
    var moduleExportsSpy = jasmine
      .createSpy('moduleExports')
      .and.returnValue('module result');
    var getModuleExportsSpy = jasmine
      .createSpy('getModuleExports')
      .and.returnValue(moduleExportsSpy);

    expect(
      createExecuteDelegateModule(
        { getModuleExports: getModuleExportsSpy },
        emptyFn
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

      createExecuteDelegateModule(
        {
          getModuleExports: function () {
            return moduleExportsSpy;
          }
        },
        emptyFn
      )(moduleDescriptor, event);

      expect(moduleExportsSpy).toHaveBeenCalledWith(undefined);
    }
  );

  it('throws an error if the module export is not a function', function () {
    expect(function () {
      createExecuteDelegateModule(
        {
          getModuleExports: function () {
            return 5;
          }
        },
        emptyFn
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

    createExecuteDelegateModule(
      {
        getModuleExports: function () {
          return moduleExportsSpy;
        }
      },
      function () {
        return { key: 'replaced tokens value' };
      }
    )(moduleDescriptor, event, moduleCallParameters);

    expect(settings).toEqual({
      key: 'replaced tokens value'
    });
  });

  it(
    'calls replaceTokens with an empty settings object if not' +
      ' present on the moduleDescriptor',
    function () {
      var replaceTokensSpy = jasmine.createSpy('replaceTokens');

      createExecuteDelegateModule(
        {
          getModuleExports: function () {
            return emptyFn;
          }
        },
        replaceTokensSpy
      )({ modulePath: 'path' }, event, moduleCallParameters);

      expect(replaceTokensSpy).toHaveBeenCalledWith({}, event);
    }
  );
});
