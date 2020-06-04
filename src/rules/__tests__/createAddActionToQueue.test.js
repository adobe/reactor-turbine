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
    var normalizeRuleComponentError = emptyFn;
    var logActionError = emptyFn;
    var lastPromiseInQueue = Promise.resolve();

    return createAddActionToQueue(
      executeDelegateModuleSpy,
      normalizeRuleComponentError,
      logActionError
    )(action, rule, event, lastPromiseInQueue).then(function () {
      expect(executeDelegateModuleSpy).toHaveBeenCalledWith(
        action,
        'actions',
        event,
        [event]
      );
    });
  });

  it('returns a promise that is rejected when the action module throws an error', function () {
    var e = new Error('some error');
    var executeDelegateModule = function () {
      throw e;
    };
    var normalizeRuleComponentErrorSpy = jasmine
      .createSpy('normalizeRuleComponentError')
      .and.returnValue('normalized error');
    var logActionError = emptyFn;
    var lastPromiseInQueue = Promise.resolve();

    return createAddActionToQueue(
      executeDelegateModule,
      normalizeRuleComponentErrorSpy,
      logActionError
    )(action, rule, event, lastPromiseInQueue).then(
      fail.bind('You should never get in the resolved state for this test'),
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
      var executeDelegateModule = function () {
        throw e;
      };
      var normalizeRuleComponentError = function (e) {
        return e;
      };
      var logActionErrorSpy = jasmine.createSpy('logActionError');
      var lastPromiseInQueue = Promise.resolve();

      return createAddActionToQueue(
        executeDelegateModule,
        normalizeRuleComponentError,
        logActionErrorSpy
      )(action, rule, event, lastPromiseInQueue).then(
        fail.bind('You should never get in the resolved state for this test'),
        function () {
          expect(logActionErrorSpy).toHaveBeenCalledWith(action, rule, e);
        }
      );
    }
  );

  it('returns a promise that is rejected if the action timeout is surpassed', function () {
    var executeDelegateModule = function () {
      return new Promise(function (resolve) {
        setTimeout(resolve, 100);
      });
    };
    var normalizeRuleComponentError = function (e) {
      return e;
    };
    var logActionError = emptyFn;
    var lastPromiseInQueue = Promise.resolve();

    return createAddActionToQueue(
      executeDelegateModule,
      normalizeRuleComponentError,
      logActionError
    )(
      { modulePath: 'action1', timeout: 10, settings: {} },
      rule,
      event,
      lastPromiseInQueue
    ).then(
      fail.bind('You should never get in the resolved state for this test'),
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
    'returns a promise that is resolved immediately if the action timeout is ' +
      'not defined',
    function () {
      var executeDelegateModule = function () {
        return new Promise(function (resolve) {
          setTimeout(resolve, 100);
        });
      };
      var normalizeRuleComponentError = function (e) {
        return e;
      };
      var logActionError = emptyFn;
      var lastPromiseInQueue = Promise.resolve();

      return createAddActionToQueue(
        executeDelegateModule,
        normalizeRuleComponentError,
        logActionError
      )(
        { modulePath: 'action1', settings: {} },
        rule,
        event,
        lastPromiseInQueue
      ).then(function (result) {
        expect(result).toBeUndefined();
      });
    }
  );
});
