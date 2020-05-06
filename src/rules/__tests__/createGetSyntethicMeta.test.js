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

var createGetSyntheticEventMeta = require('../createGetSyntheticEventMeta');

describe('createGetSyntheticEventMeta returns a function that when called', function () {
  it('returns the synthetic event', function () {
    var getModuleDefinitionSpy = jasmine
      .createSpy('getModuleDefinition')
      .and.returnValue({ name: 'moduleName' });
    var getModuleExtensionNameSpy = jasmine
      .createSpy('getModuleExtensionName')
      .and.returnValue('extensionName');

    var moduleProvider = {
      getModuleDefinition: getModuleDefinitionSpy,
      getModuleExtensionName: getModuleExtensionNameSpy
    };

    var ruleEventPair = {
      rule: { name: 'rule name', id: 'rule id' },
      event: { modulePath: 'event module path' }
    };

    var syntheticEventMeta = createGetSyntheticEventMeta(moduleProvider)(
      ruleEventPair
    );

    expect(getModuleDefinitionSpy).toHaveBeenCalledWith('event module path');
    expect(getModuleExtensionNameSpy).toHaveBeenCalledWith('event module path');
    expect(syntheticEventMeta).toEqual({
      $type: 'extensionName.moduleName',
      $rule: {
        id: 'rule id',
        name: 'rule name'
      }
    });
  });
});
