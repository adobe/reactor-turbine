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

var createGetModuleDisplayNameByRuleComponent = require('../createGetModuleDisplayNameByRuleComponent');

describe(
  'createGetModuleDisplayNameByRuleComponent ' +
    ' returns a function that when called',
  function () {
    it('returns the display name if available', function () {
      var getModuleDefinitionSpy = jasmine
        .createSpy('getModuleDefinition')
        .and.returnValue({ displayName: 'display name' });

      var moduleProvider = {
        getModuleDefinition: getModuleDefinitionSpy
      };
      var ruleComponent = {
        modulePath: 'event module path'
      };

      var displayName = createGetModuleDisplayNameByRuleComponent(
        moduleProvider
      )(ruleComponent);

      expect(getModuleDefinitionSpy).toHaveBeenCalledWith('event module path');
      expect(displayName).toBe('display name');
    });

    it('returns module path when display name is not found', function () {
      var moduleProvider = {
        getModuleDefinition: jasmine.createSpy('getModuleDefinition')
      };
      var ruleComponent = {
        modulePath: 'event module path'
      };

      var displayName = createGetModuleDisplayNameByRuleComponent(
        moduleProvider
      )(ruleComponent);

      expect(displayName).toBe('event module path');
    });
  }
);
