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
var createAddActionToQueue = require('../createAddActionToQueue');
var emptyFn = function () {};

var action = { modulePath: 'action1', settings: {} };
var event = { $type: 'type' };
var rule = { id: 'rule id' };

describe('createAddActionToQueue returns a function that when called', function () {
  it('returns a promise that is resolved when the action module is met', function () {
    var executeDelegateModuleSpy = jasmine
      .createSpy('executeDelegateModule')
      .and.returnValue(Promise.resolve());

    return createAddActionToQueue(executeDelegateModuleSpy, emptyFn, emptyFn)(
      action,
      rule,
      event,
      Promise.resolve()
    ).then(function () {
      expect(executeDelegateModuleSpy).toHaveBeenCalledWith(action, event, [
        event
      ]);
    });
  });

  it('returns a promise that is rejected when the action module throws an error', function () {
    var normalizeRuleComponentErrorSpy = jasmine
      .createSpy('normalizeRuleComponentError')
      .and.returnValue('normalized error');

    var e = new Error('some error');

    return createAddActionToQueue(
      function () {
        throw e;
      },
      normalizeRuleComponentErrorSpy,
      emptyFn
    )(action, rule, event, Promise.resolve()).then(
      function () {
        throw new Error(
          'You should never get in the resolved state for this test'
        );
      },
      function (error) {
        expect(normalizeRuleComponentErrorSpy).toHaveBeenCalledWith(e);
        expect(error).toBe('normalized error');
      }
    );
  });

  it(
    'returns a promise that calls logActionError when ' +
      'the action module throws an error',
    function () {
      var e = new Error('some error');
      var logActionErrorSpy = jasmine.createSpy('logActionError');

      return createAddActionToQueue(
        function () {
          throw e;
        },
        function (e) {
          return e;
        },
        logActionErrorSpy
      )(action, rule, event, Promise.resolve()).then(
        function () {
          throw new Error(
            'You should never get in the resolved state for this test'
          );
        },
        function () {
          expect(logActionErrorSpy).toHaveBeenCalledWith(action, rule, e);
        }
      );
    }
  );

  it('returns a promise that is rejected if the action timeout is surpassed', function () {
    return createAddActionToQueue(
      function () {
        return new Promise(function (resolve) {
          setTimeout(resolve, 100);
        });
      },
      function (e) {
        return e;
      },
      emptyFn
    )(
      { modulePath: 'action1', settings: { timeout: 10 } },
      rule,
      event,
      Promise.resolve()
    ).then(
      function () {
        throw new Error(
          'You should never get in the resolved state for this test'
        );
      },
      function (e) {
        expect(e).toEqual(
          new Error(
            'A timeout occurred because the action took longer than 0.01 seconds to complete. '
          )
        );
      }
    );
  });

  it(
    'returns a promise that is resolved imediatelly if the action timeout is ' +
      'not defined',
    function () {
      return createAddActionToQueue(
        function () {
          return new Promise(function (resolve) {
            setTimeout(resolve, 100);
          });
        },
        function (e) {
          return e;
        },
        emptyFn
      )(
        { modulePath: 'action1', settings: {} },
        rule,
        event,
        Promise.resolve()
      ).then(function (result) {
        expect(result).toBeUndefined();
      });
    }
  );
});
