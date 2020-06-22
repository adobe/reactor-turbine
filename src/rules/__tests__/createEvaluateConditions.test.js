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

  it('handles condition returning true', function () {
    var executeDelegateModule = function (condition) {
      return condition.modulePath === 'condition1';
    };

    var isConditionMet = function (_, result) {
      return result;
    };

    var logConditionNotMetSpy = jasmine.createSpy();
    var logConditionErrorSpy = jasmine.createSpy();
    var result = createEvaluateConditions(
      executeDelegateModule,
      isConditionMet,
      logConditionNotMetSpy,
      logConditionErrorSpy
    )(rule);

    expect(result).toBeTrue();
    expect(logConditionNotMetSpy).not.toHaveBeenCalled();
    expect(logConditionErrorSpy).not.toHaveBeenCalled();
  });

  it('handles a condition returning a promise', function () {
    var executeDelegateModule = function () {
      // Not using a real promise to ensure that the logic detects
      // objects that are promise-like.
      return {
        then: function () {}
      };
    };
    var isConditionMet = jasmine.createSpy();
    var logConditionNotMetSpy = jasmine.createSpy();
    var logConditionErrorSpy = jasmine.createSpy();
    var result = createEvaluateConditions(
      executeDelegateModule,
      isConditionMet,
      logConditionNotMetSpy,
      logConditionErrorSpy
    )(rule);

    expect(result).toBeFalse();
    expect(isConditionMet).not.toHaveBeenCalled();
    expect(logConditionNotMetSpy).not.toHaveBeenCalled();
    expect(logConditionErrorSpy).toHaveBeenCalledWith(
      rule.conditions[0],
      rule,
      new Error(
        'Rule component sequencing must be enabled on the property ' +
          'for this condition to function properly.'
      )
    );
  });

  it('handles a condition not being met', function () {
    var executeDelegateModule = function (condition) {
      return condition.modulePath === 'condition1';
    };
    var isConditionMet = function () {
      return false;
    };

    var logConditionNotMetSpy = jasmine.createSpy();
    var logConditionErrorSpy = jasmine.createSpy();
    var result = createEvaluateConditions(
      executeDelegateModule,
      isConditionMet,
      logConditionNotMetSpy,
      logConditionErrorSpy
    )(rule);

    expect(result).toBeFalse();
    expect(logConditionNotMetSpy).toHaveBeenCalledWith(
      rule.conditions[0],
      rule
    );
    expect(logConditionErrorSpy).not.toHaveBeenCalled();
  });

  it('handles a condition throwing an error', function () {
    var e = new Error('some error');
    var executeDelegateModule = function () {
      throw e;
    };
    var isConditionMetSpy = jasmine.createSpy();
    var logConditionNotMetSpy = jasmine.createSpy();
    var logConditionErrorSpy = jasmine.createSpy();
    var result = createEvaluateConditions(
      executeDelegateModule,
      isConditionMetSpy,
      logConditionNotMetSpy,
      logConditionErrorSpy
    )(rule);

    expect(result).toBeFalse();
    expect(isConditionMetSpy).not.toHaveBeenCalled();
    expect(logConditionNotMetSpy).not.toHaveBeenCalled();
    expect(logConditionErrorSpy).toHaveBeenCalledWith(
      rule.conditions[0],
      rule,
      e
    );
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
      event,
      [event]
    );

    expect(executeDelegateModuleSpy).toHaveBeenCalledWith(
      conditions[1],
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
      event,
      [event]
    );
    expect(executeDelegateModuleSpy.calls.all().length).toBe(1);
  });
});
