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

var initRules = require('../initRules');
var buildRuleExecutionOrder = function (r) {
  return r;
};

describe('initRules', function () {
  it(
    'lets buildRuleExecutionOrder module to determine the ' +
      'way the rules are executed',
    function () {
      var buildRuleExecutionOrder = jasmine
        .createSpy()
        .and.callFake(function (rules) {
          return rules;
        });

      initRules(buildRuleExecutionOrder, [{ ruleId: 123 }], function () {});
      expect(buildRuleExecutionOrder).toHaveBeenCalledWith([{ ruleId: 123 }]);
    }
  );

  it('calls initEventModule module for each rule', function () {
    var initEventModule = jasmine.createSpy();
    var rules = [{ ruleId: 123 }, { ruleId: 124 }];
    initRules(buildRuleExecutionOrder, rules, initEventModule);

    expect(initEventModule).toHaveBeenCalledWith(jasmine.any(Function), {
      ruleId: 123
    });

    expect(initEventModule).toHaveBeenCalledWith(jasmine.any(Function), {
      ruleId: 124
    });
  });

  it('delays the actual rule triggering until all event modules are initialized', function () {
    // Force reloading the initRules module in this test in order to initialize
    // the module with eventModulesInitialized=false.
    delete require.cache[require.resolve('../initRules')];
    var initRules = require('../initRules');
    var index = 0;

    var rules = [{ ruleId: 123 }, { ruleId: 124 }];

    var triggerForRule123 = jasmine.createSpy('rule123');
    var triggerForRule124 = jasmine.createSpy('rule124');
    var triggers = [triggerForRule123, triggerForRule124];

    initRules(buildRuleExecutionOrder, rules, function (
      guardUntilAllInitialized,
      rule
    ) {
      guardUntilAllInitialized(triggers[index]);

      if (index === 1) {
        expect(triggerForRule123).not.toHaveBeenCalled();
        expect(triggerForRule124).not.toHaveBeenCalled();
      }

      index += 1;
    });

    expect(triggerForRule123).toHaveBeenCalled();
    expect(triggerForRule124).toHaveBeenCalled();
  });

  it('after all modules are intialized it executes triggers immediately', function () {
    // Force reloading the initRules module in this test in order to initialize
    // the module with eventModulesInitialized=false.
    delete require.cache[require.resolve('../initRules')];
    var initRules = require('../initRules');

    var guardUntilAllInitialized;
    var rules = [{ ruleId: 123 }];

    var triggerForRule123 = jasmine.createSpy('rule123');

    initRules(buildRuleExecutionOrder, rules, function (g) {
      guardUntilAllInitialized = g;
    });

    expect(triggerForRule123).not.toHaveBeenCalled();
    guardUntilAllInitialized(triggerForRule123);
    expect(triggerForRule123).toHaveBeenCalled();
  });
});
