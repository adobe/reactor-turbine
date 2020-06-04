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

var createEvaluateConditions = require('../createEvaluateConditions');
var emptyFn = function () {};
var rule = {
  conditions: [
    {
      modulePath: 'condition1'
    }
  ]
};

describe('createEvaluateConditions returns a function that when called', function () {
  it('returns true when rule does not have conditons', function () {
    var rule = { id: 'rule id' };
    expect(createEvaluateConditions()(rule)).toBeTrue();
  });

  it('returns true when conditions are met', function () {
    var executeDelegateModule = function (condition) {
      return condition.modulePath === 'condition1';
    };

    var isConditionMet = function (_, result) {
      return result;
    };

    var logConditionNotMet = emptyFn;
    var logConditionError = emptyFn;

    expect(
      createEvaluateConditions(
        executeDelegateModule,
        isConditionMet,
        logConditionNotMet,
        logConditionError
      )(rule)
    ).toBeTrue();
  });

  it('returns false when conditions are not met', function () {
    var executeDelegateModule = function (condition) {
      return condition.modulePath === 'condition1';
    };
    var isConditionMet = function () {
      return false;
    };

    var logConditionNotMet = emptyFn;
    var logConditionError = emptyFn;

    expect(
      createEvaluateConditions(
        executeDelegateModule,
        isConditionMet,
        logConditionNotMet,
        logConditionError
      )(rule)
    ).toBeFalse();
  });

  it('calls logConditionNotMet when conditions are not met', function () {
    var executeDelegateModule = function (condition) {
      return condition.modulePath === 'condition1';
    };
    var isConditionMet = function () {
      return false;
    };
    var logConditionNotMetSpy = jasmine.createSpy('logConditionNotMet');
    var logConditionError = emptyFn;
    var condition = {
      modulePath: 'condition1'
    };
    var rule = {
      conditions: [condition]
    };

    createEvaluateConditions(
      executeDelegateModule,
      isConditionMet,
      logConditionNotMetSpy,
      logConditionError
    )(rule);

    expect(logConditionNotMetSpy).toHaveBeenCalledWith(condition, rule);
  });

  it('returns false when a condition throws an error', function () {
    var executeDelegateModule = function () {
      throw new Error('some error');
    };
    var isConditionMet = emptyFn;
    var logConditionNotMet = emptyFn;
    var logConditionError = emptyFn;

    expect(
      createEvaluateConditions(
        executeDelegateModule,
        isConditionMet,
        logConditionNotMet,
        logConditionError
      )({
        conditions: [
          {
            modulePath: 'condition1'
          }
        ]
      })
    ).toBeFalse();
  });

  it('calls logConditionError when a condition throws an error', function () {
    var executeDelegateModule = function () {
      throw e;
    };
    var isConditionMet = emptyFn;
    var logConditionNotMet = emptyFn;
    var logConditionErrorSpy = jasmine.createSpy('logConditionError');
    var e = new Error('some error');

    var condition = {
      modulePath: 'condition1'
    };
    var rule = {
      conditions: [condition]
    };

    createEvaluateConditions(
      executeDelegateModule,
      isConditionMet,
      logConditionNotMet,
      logConditionErrorSpy
    )(rule);

    expect(logConditionErrorSpy).toHaveBeenCalledWith(condition, rule, e);
  });

  it('calls executeDelegateModule for each condition', function () {
    var executeDelegateModuleSpy = jasmine.createSpy('executeDelegateModule');
    var isConditionMet = function () {
      return true;
    };
    var logConditionNotMet = emptyFn;
    var logConditionError = emptyFn;

    var conditions = [
      {
        modulePath: 'condition1'
      },
      {
        modulePath: 'condition2'
      }
    ];
    var rule = {
      conditions: conditions
    };
    var event = { $type: 'some type' };

    createEvaluateConditions(
      executeDelegateModuleSpy,
      isConditionMet,
      logConditionNotMet,
      logConditionError
    )(rule, event);

    expect(executeDelegateModuleSpy).toHaveBeenCalledWith(
      conditions[0],
      'conditions',
      event,
      [event]
    );

    expect(executeDelegateModuleSpy).toHaveBeenCalledWith(
      conditions[1],
      'conditions',
      event,
      [event]
    );
  });

  it('does not evaluate other conditions once a condition fails', function () {
    var executeDelegateModuleSpy = jasmine.createSpy('executeDelegateModule');
    var isConditionMet = function () {
      return false;
    };
    var logConditionNotMet = emptyFn;
    var logConditionError = emptyFn;
    var event = { $type: 'some type' };
    var conditions = [
      {
        modulePath: 'condition1'
      },
      {
        modulePath: 'condition2'
      }
    ];
    var rule = {
      conditions: conditions
    };

    createEvaluateConditions(
      executeDelegateModuleSpy,
      isConditionMet,
      logConditionNotMet,
      logConditionError
    )(rule, event);

    expect(executeDelegateModuleSpy).toHaveBeenCalledWith(
      conditions[0],
      'conditions',
      event,
      [event]
    );
    expect(executeDelegateModuleSpy.calls.all().length).toBe(1);
  });
});
