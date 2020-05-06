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
var createAddConditionToQueue = require('../createAddConditionToQueue');
var emptyFn = function () {};

var condition = { modulePath: 'condition1', settings: {} };
var event = { $type: 'type' };
var rule = { id: 'rule id' };

describe('createAddRuleToQueue returns a function that when called', function () {
  it('returns a promise that is resolved when the condition module is met', function () {
    var executeDelegateModuleSpy = jasmine
      .createSpy('executeDelegateModule')
      .and.returnValue(Promise.resolve());

    return createAddConditionToQueue(
      executeDelegateModuleSpy,
      emptyFn,
      function () {
        return true;
      },
      emptyFn,
      emptyFn
    )(condition, rule, event, Promise.resolve()).then(function () {
      expect(executeDelegateModuleSpy).toHaveBeenCalledWith(condition, event, [
        event
      ]);
    });
  });

  it('returns a promise that is rejected when the condition module is not met', function () {
    var isConditionMetSpy = jasmine
      .createSpy('isConditionMet')
      .and.returnValue(false);

    return createAddConditionToQueue(
      function () {
        return false;
      },
      emptyFn,
      isConditionMetSpy,
      emptyFn,
      emptyFn
    )(condition, rule, event, Promise.resolve()).then(
      fail.bind('You should never get in the resolved state for this test'),
      function () {
        expect(isConditionMetSpy).toHaveBeenCalledWith(condition, false);
      }
    );
  });

  it('returns a promise that calls logConditionNotMet when the condition is not met', function () {
    var logConditionNotMetSpy = jasmine.createSpy('logConditionNotMet');

    return createAddConditionToQueue(
      emptyFn,
      emptyFn,
      function () {
        return false;
      },
      emptyFn,
      logConditionNotMetSpy
    )(condition, rule, event, Promise.resolve()).then(
      fail.bind('You should never get in the resolved state for this test'),
      function () {
        expect(logConditionNotMetSpy).toHaveBeenCalledWith(condition, rule);
      }
    );
  });

  it('returns a promise that is rejected when the condition module throws an error', function () {
    var normalizeRuleComponentErrorSpy = jasmine
      .createSpy('normalizeRuleComponentError')
      .and.returnValue('normalized error');

    var e = new Error('some error');

    return createAddConditionToQueue(
      function () {
        throw e;
      },
      normalizeRuleComponentErrorSpy,
      emptyFn,
      emptyFn,
      emptyFn
    )(condition, rule, event, Promise.resolve()).then(
      fail.bind('You should never get in the resolved state for this test'),
      function (error) {
        expect(normalizeRuleComponentErrorSpy).toHaveBeenCalledWith(e);
        expect(error).toBe('normalized error');
      }
    );
  });

  it(
    'returns a promise that calls logConditionError when ' +
      'the condition module throws an error',
    function () {
      var e = new Error('some error');
      var logConditionErrorSpy = jasmine.createSpy('logConditionError');

      return createAddConditionToQueue(
        function () {
          throw e;
        },
        function (e) {
          return e;
        },
        emptyFn,
        logConditionErrorSpy,
        emptyFn
      )(condition, rule, event, Promise.resolve()).then(
        fail.bind('You should never get in the resolved state for this test'),
        function () {
          expect(logConditionErrorSpy).toHaveBeenCalledWith(condition, rule, e);
        }
      );
    }
  );

  it('returns a promise that is rejected if the condition timeout is surpassed', function () {
    return createAddConditionToQueue(
      function () {
        return new Promise(function (resolve) {
          setTimeout(resolve, 100);
        });
      },
      function (e) {
        return e;
      },
      emptyFn,
      emptyFn,
      emptyFn
    )(
      { modulePath: 'condition1', settings: { timeout: 10 } },
      rule,
      event,
      Promise.resolve()
    ).then(
      fail.bind('You should never get in the resolved state for this test'),
      function (e) {
        expect(e).toEqual(
          new Error(
            'A timeout occurred because the condition took longer than 0.01 seconds to complete. '
          )
        );
      }
    );
  });

  it(
    'returns a promise that is rejected if the condition timeout is ' +
      'not defined and also surpassed',
    function () {
      return createAddConditionToQueue(
        function () {
          return new Promise(function (resolve) {
            setTimeout(resolve, 100);
          });
        },
        function (e) {
          return e;
        },
        emptyFn,
        emptyFn,
        emptyFn
      )(
        { modulePath: 'condition1', settings: {} },
        rule,
        event,
        Promise.resolve()
      ).then(
        fail.bind('You should never get in the resolved state for this test'),
        function (e) {
          expect(e).toEqual(
            new Error(
              'A timeout occurred because the condition took longer than 0 seconds to complete. '
            )
          );
        }
      );
    }
  );
});
