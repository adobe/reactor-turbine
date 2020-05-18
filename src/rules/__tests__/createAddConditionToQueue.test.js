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

    var normalizeRuleComponentError = emptyFn;
    var isConditionMet = function () {
      return true;
    };
    var logConditionError = emptyFn;
    var logConditionNotMet = emptyFn;
    var lastPromiseInQueue = Promise.resolve();

    return createAddConditionToQueue(
      executeDelegateModuleSpy,
      normalizeRuleComponentError,
      isConditionMet,
      logConditionError,
      logConditionNotMet
    )(condition, rule, event, lastPromiseInQueue).then(function () {
      expect(executeDelegateModuleSpy).toHaveBeenCalledWith(condition, event, [
        event
      ]);
    });
  });

  it('returns a promise that is rejected when the condition module is not met', function () {
    var executeDelegateModule = function () {
      return false;
    };

    var normalizeRuleComponentError = emptyFn;
    var isConditionMetSpy = jasmine
      .createSpy('isConditionMet')
      .and.returnValue(false);

    var logConditionError = emptyFn;
    var logConditionNotMet = emptyFn;
    var lastPromiseInQueue = Promise.resolve();

    return createAddConditionToQueue(
      executeDelegateModule,
      normalizeRuleComponentError,
      isConditionMetSpy,
      logConditionError,
      logConditionNotMet
    )(condition, rule, event, lastPromiseInQueue).then(
      fail.bind('You should never get in the resolved state for this test'),
      function () {
        expect(isConditionMetSpy).toHaveBeenCalledWith(condition, false);
      }
    );
  });

  it('returns a promise that calls logConditionNotMet when the condition is not met', function () {
    var executeDelegateModule = emptyFn;
    var normalizeRuleComponentError = emptyFn;
    var isConditionMet = function () {
      return false;
    };
    var logConditionError = emptyFn;
    var logConditionNotMetSpy = jasmine.createSpy('logConditionNotMet');
    var lastPromiseInQueue = Promise.resolve();

    return createAddConditionToQueue(
      executeDelegateModule,
      normalizeRuleComponentError,
      isConditionMet,
      logConditionError,
      logConditionNotMetSpy
    )(condition, rule, event, lastPromiseInQueue).then(
      fail.bind('You should never get in the resolved state for this test'),
      function () {
        expect(logConditionNotMetSpy).toHaveBeenCalledWith(condition, rule);
      }
    );
  });

  it('returns a promise that is rejected when the condition module throws an error', function () {
    var e = new Error('some error');
    var executeDelegateModule = function () {
      throw e;
    };
    var normalizeRuleComponentErrorSpy = jasmine
      .createSpy('normalizeRuleComponentError')
      .and.returnValue('normalized error');

    var isConditionMet = emptyFn;
    var logConditionError = emptyFn;
    var logConditionNotMet = emptyFn;
    var lastPromiseInQueue = Promise.resolve();

    return createAddConditionToQueue(
      executeDelegateModule,
      normalizeRuleComponentErrorSpy,
      isConditionMet,
      logConditionError,
      logConditionNotMet
    )(condition, rule, event, lastPromiseInQueue).then(
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
      var executeDelegateModule = function () {
        throw e;
      };
      var normalizeRuleComponentError = function (e) {
        return e;
      };
      var isConditionMet = emptyFn;
      var logConditionErrorSpy = jasmine.createSpy('logConditionError');
      var logConditionNotMet = emptyFn;
      var lastPromiseInQueue = Promise.resolve();

      return createAddConditionToQueue(
        executeDelegateModule,
        normalizeRuleComponentError,
        isConditionMet,
        logConditionErrorSpy,
        logConditionNotMet
      )(condition, rule, event, lastPromiseInQueue).then(
        fail.bind('You should never get in the resolved state for this test'),
        function () {
          expect(logConditionErrorSpy).toHaveBeenCalledWith(condition, rule, e);
        }
      );
    }
  );

  it('returns a promise that is rejected if the condition timeout is surpassed', function () {
    var executeDelegateModule = function () {
      return new Promise(function (resolve) {
        setTimeout(resolve, 100);
      });
    };
    var normalizeRuleComponentError = function (e) {
      return e;
    };
    var isConditionMet = emptyFn;
    var logConditionError = emptyFn;
    var logConditionNotMet = emptyFn;
    var lastPromiseInQueue = Promise.resolve();
    var condition = { modulePath: 'condition1', timeout: 10, settings: {} };

    return createAddConditionToQueue(
      executeDelegateModule,
      normalizeRuleComponentError,
      isConditionMet,
      logConditionError,
      logConditionNotMet
    )(condition, rule, event, lastPromiseInQueue).then(
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
      var executeDelegateModule = function () {
        return new Promise(function (resolve) {
          setTimeout(resolve, 100);
        });
      };
      var normalizeRuleComponentError = function (e) {
        return e;
      };
      var isConditionMet = emptyFn;
      var logConditionError = emptyFn;
      var logConditionNotMet = emptyFn;
      var lastPromiseInQueue = Promise.resolve();
      var condition = { modulePath: 'condition1', settings: {} };

      return createAddConditionToQueue(
        executeDelegateModule,
        normalizeRuleComponentError,
        isConditionMet,
        logConditionError,
        logConditionNotMet
      )(condition, rule, event, lastPromiseInQueue).then(
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
