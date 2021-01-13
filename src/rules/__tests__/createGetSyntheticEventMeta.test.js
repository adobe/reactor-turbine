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

describe('createGetSyntheticEventMeta returns an object with the expected args', function () {
  it('returns the display name if available', function () {
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
      rule: {
        modulePath: 'rule1 path',
        id: 'ruleEventPairRuleId',
        name: 'ruleEventPairRuleName'
      },
      event: { modulePath: 'event1 path', settings: { key: 'value' } }
    };

    var syntheticEvent = createGetSyntheticEventMeta(moduleProvider)(
      ruleEventPair
    );

    expect(getModuleDefinitionSpy).toHaveBeenCalledWith('event1 path');
    expect(getModuleExtensionNameSpy).toHaveBeenCalledWith('event1 path');

    expect(syntheticEvent.$type).toBe('extensionName.moduleName');
    expect(syntheticEvent.$rule.id).toBe('ruleEventPairRuleId');
    expect(syntheticEvent.$rule.name).toBe('ruleEventPairRuleName');
  });
});
