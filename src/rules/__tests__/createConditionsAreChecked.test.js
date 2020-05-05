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

var createConditionsAreChecked = require('../createConditionsAreChecked');
var emptyFn = function () {};

describe('createConditionsAreChecked returns a function that when called', function () {
  it('returns true when rule does not have conditons', function () {
    expect(createConditionsAreChecked()({ id: 'rule id' })).toBeTrue();
  });

  it('returns true when conditions are met', function () {
    expect(
      createConditionsAreChecked(
        function (condition) {
          return condition.modulePath === 'condition1';
        },
        function (_, result) {
          return result;
        },
        emptyFn
      )({
        conditions: [
          {
            modulePath: 'condition1'
          }
        ]
      })
    ).toBeTrue();
  });

  it('returns false when conditions are not met', function () {
    expect(
      createConditionsAreChecked(
        function (condition) {
          return condition.modulePath === 'condition1';
        },
        function () {
          return false;
        },
        emptyFn
      )({
        conditions: [
          {
            modulePath: 'condition1'
          }
        ]
      })
    ).toBeFalse();
  });

  it('calls logConditionNotMet when conditions are not met', function () {
    var logConditionNotMetSpy = jasmine.createSpy('logConditionNotMet');
    var condition = {
      modulePath: 'condition1'
    };
    var rule = {
      conditions: [condition]
    };

    createConditionsAreChecked(
      function (condition) {
        return condition.modulePath === 'condition1';
      },
      function () {
        return false;
      },
      logConditionNotMetSpy
    )(rule);

    expect(logConditionNotMetSpy).toHaveBeenCalledWith(condition, rule);
  });

  it('returns false when a condition throws an error', function () {
    expect(
      createConditionsAreChecked(
        function () {
          throw new Error('some error');
        },
        emptyFn,
        emptyFn,
        emptyFn
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
    var logConditionErrorSpy = jasmine.createSpy('logConditionError');
    var e = new Error('some error');

    var condition = {
      modulePath: 'condition1'
    };
    var rule = {
      conditions: [condition]
    };

    createConditionsAreChecked(
      function () {
        throw e;
      },
      emptyFn,
      emptyFn,
      logConditionErrorSpy
    )(rule);

    expect(logConditionErrorSpy).toHaveBeenCalledWith(condition, rule, e);
  });

  it('calls executeDelegateModule for each condition', function () {
    var executeDelegateModuleSpy = jasmine.createSpy('executeDelegateModule');
    var event = { $type: 'some type' };
    var conditions = [
      {
        modulePath: 'condition1'
      },
      {
        modulePath: 'condition2'
      }
    ];

    createConditionsAreChecked(
      executeDelegateModuleSpy,
      function () {
        return true;
      },
      emptyFn
    )(
      {
        conditions: conditions
      },
      event
    );

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
    var event = { $type: 'some type' };
    var conditions = [
      {
        modulePath: 'condition1'
      },
      {
        modulePath: 'condition2'
      }
    ];

    createConditionsAreChecked(
      executeDelegateModuleSpy,
      function () {
        return false;
      },
      emptyFn
    )(
      {
        conditions: conditions
      },
      event
    );

    expect(executeDelegateModuleSpy).toHaveBeenCalledWith(
      conditions[0],
      event,
      [event]
    );
    expect(executeDelegateModuleSpy.calls.all().length).toBe(1);
  });
});
