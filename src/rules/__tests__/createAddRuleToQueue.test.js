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

var Promise = require('@adobe/reactor-promise');
var createAddRuleToQueue;

var emptyFn = function () {};

describe('createAddRuleToQueue returns a function that when called', function () {
  beforeEach(function () {
    createAddRuleToQueue = require('../createAddRuleToQueue');
  });

  afterEach(function () {
    delete require.cache[require.resolve('../createAddRuleToQueue')];
  });

  it('adds each rule condition to the queue', function () {
    var rule = {
      conditions: [{ modulePath: 'condition1' }, { modulePath: 'condition2' }]
    };
    var event = { $type: 'type' };
    var addConditionToQueueSpy = jasmine
      .createSpy('addConditionToQueueSpy')
      .and.returnValue(Promise.resolve());

    return createAddRuleToQueue(
      addConditionToQueueSpy,
      emptyFn,
      emptyFn
    )(rule, event).then(function () {
      expect(addConditionToQueueSpy).toHaveBeenCalledWith(
        rule.conditions[0],
        rule,
        event,
        jasmine.any(Promise)
      );
      expect(addConditionToQueueSpy).toHaveBeenCalledWith(
        rule.conditions[1],
        rule,
        event,
        jasmine.any(Promise)
      );
    });
  });

  it('adds each rule action to the queue', function () {
    var rule = {
      actions: [{ modulePath: 'action1' }, { modulePath: 'action2' }]
    };
    var event = { $type: 'type' };
    var addActionToQueueSpy = jasmine
      .createSpy('addActionToQueue')
      .and.returnValue(Promise.resolve());

    return createAddRuleToQueue(
      emptyFn,
      addActionToQueueSpy,
      emptyFn
    )(rule, event).then(function () {
      expect(addActionToQueueSpy).toHaveBeenCalledWith(
        rule.actions[0],
        rule,
        event,
        jasmine.any(Promise)
      );
      expect(addActionToQueueSpy).toHaveBeenCalledWith(
        rule.actions[1],
        rule,
        event,
        jasmine.any(Promise)
      );
    });
  });

  it('does not throw an error if there are no conditions or actions in a rule', function () {
    var rule = {};
    var event = { $type: 'type' };

    return createAddRuleToQueue(emptyFn, emptyFn, emptyFn)(rule, event);
  });

  it('calls logRuleCompleted once the rule is completed', function () {
    var rule = { name: 'rule1' };
    var event = { $type: 'type' };
    var logRuleCompletedSpy = jasmine.createSpy('logRuleCompleted');

    return createAddRuleToQueue(
      emptyFn,
      emptyFn,
      logRuleCompletedSpy
    )(rule, event).then(function () {
      expect(logRuleCompletedSpy).toHaveBeenCalledWith(rule);
    });
  });

  it('does not throw an error if a module returns a rejected promise', function () {
    var rule = { name: 'rule1', actions: [{ modulePath: 'path1' }] };
    var event = { $type: 'type' };

    return createAddRuleToQueue(
      emptyFn,
      function () {
        return new Promise(function (_, reject) {
          reject(new Error('some error'));
        });
      },
      emptyFn
    )(rule, event);
  });
});
