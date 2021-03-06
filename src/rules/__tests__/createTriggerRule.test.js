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

var createTriggerRule = require('../createTriggerRule');
var emptyFn = function () {};

describe('createTriggerRule returns a function that when called', function () {
  it('notifies monitors about the rule being triggered', function () {
    var notifyMonitorsSpy = jasmine.createSpy('notifyMonitors');
    var rule = { ruleId: '123' };

    var ruleComponentSequencingEnabled = true;
    var executeRule = emptyFn;
    var addRuleToQueue = emptyFn;
    var normalizedSyntheticEvent = {};

    createTriggerRule(
      ruleComponentSequencingEnabled,
      executeRule,
      addRuleToQueue,
      notifyMonitorsSpy
    )(normalizedSyntheticEvent, rule);
    expect(notifyMonitorsSpy).toHaveBeenCalledWith('ruleTriggered', {
      rule: rule
    });
  });

  it('adds rule to queue when ruleComponentSequencingEnabled is true', function () {
    var addRuleToQueueSpy = jasmine.createSpy('addRuleToQueue');
    var rule = { ruleId: '123' };
    var normalizedSyntheticEvent = { a: 'a' };

    var ruleComponentSequencingEnabled = true;
    var executeRule = emptyFn;
    var notifyMonitors = emptyFn;

    createTriggerRule(
      ruleComponentSequencingEnabled,
      executeRule,
      addRuleToQueueSpy,
      notifyMonitors
    )(normalizedSyntheticEvent, rule);

    expect(addRuleToQueueSpy).toHaveBeenCalledWith(
      rule,
      normalizedSyntheticEvent
    );
  });

  it('executes rule immediately when ruleComponentSequencingEnabled is false', function () {
    var executeRuleSpy = jasmine.createSpy('executeRule');
    var rule = { ruleId: '123' };
    var normalizedSyntheticEvent = { a: 'a' };

    var ruleComponentSequencingEnabled = false;
    var addRuleToQueue = emptyFn;
    var notifyMonitors = emptyFn;

    createTriggerRule(
      ruleComponentSequencingEnabled,
      executeRuleSpy,
      addRuleToQueue,
      notifyMonitors
    )(normalizedSyntheticEvent, rule);

    expect(executeRuleSpy).toHaveBeenCalledWith(rule, normalizedSyntheticEvent);
  });
});
