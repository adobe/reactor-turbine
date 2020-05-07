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

var createInitEventModule = require('../createInitEventModule');
var emptyFn = function () {};

describe('createInitEventModule returns a function that when called', function () {
  it('executes the module of the provided event', function () {
    var triggerRule = emptyFn;
    var executeDelegateModuleSpy = jasmine.createSpy('executeDelegateModule');
    var normalizeSyntheticEvent = emptyFn;
    var getErrorMessage = emptyFn;
    var getSyntheticEventMeta = emptyFn;
    var logger = {};
    var guardUntilAllInitialized = emptyFn;
    var ruleEventPair = {
      rule: { modulePath: 'rule1 path' },
      event: { modulePath: 'event1 path', settings: { key: 'value' } }
    };

    createInitEventModule(
      triggerRule,
      executeDelegateModuleSpy,
      normalizeSyntheticEvent,
      getErrorMessage,
      getSyntheticEventMeta,
      logger
    )(guardUntilAllInitialized, ruleEventPair);

    expect(executeDelegateModuleSpy).toHaveBeenCalledWith(
      { modulePath: 'event1 path', settings: { key: 'value' } },
      null,
      [jasmine.any(Function)]
    );
  });

  it('executes the module of the provided event using default settings', function () {
    var triggerRule = emptyFn;
    var executeDelegateModuleSpy = jasmine.createSpy('executeDelegateModule');
    var normalizeSyntheticEvent = emptyFn;
    var getErrorMessage = emptyFn;
    var getSyntheticEventMeta = emptyFn;
    var logger = {};
    var guardUntilAllInitialized = emptyFn;
    var ruleEventPair = {
      rule: { modulePath: 'rule1 path' },
      event: { modulePath: 'event1 path' }
    };

    createInitEventModule(
      triggerRule,
      executeDelegateModuleSpy,
      normalizeSyntheticEvent,
      getErrorMessage,
      getSyntheticEventMeta,
      logger
    )(guardUntilAllInitialized, ruleEventPair);

    expect(executeDelegateModuleSpy).toHaveBeenCalledWith(
      { modulePath: 'event1 path', settings: {} },
      null,
      [jasmine.any(Function)]
    );
  });

  it('logs an error when the event module throws an error', function () {
    var triggerRule = emptyFn;
    var e = new Error('some error');
    var executeDelegateModule = function () {
      throw e;
    };
    var normalizeSyntheticEvent = emptyFn;
    var getErrorMessageSpy = jasmine
      .createSpy('getErrorMessage')
      .and.returnValue('error message');
    var getSyntheticEventMeta = emptyFn;
    var loggerSpy = jasmine.createSpyObj('logger', ['error']);
    var guardUntilAllInitialized = emptyFn;
    var ruleEventPair = {
      rule: { modulePath: 'rule1 path' },
      event: { modulePath: 'event1 path' }
    };

    createInitEventModule(
      triggerRule,
      executeDelegateModule,
      normalizeSyntheticEvent,
      getErrorMessageSpy,
      getSyntheticEventMeta,
      loggerSpy
    )(guardUntilAllInitialized, ruleEventPair);

    expect(getErrorMessageSpy).toHaveBeenCalledWith(
      { modulePath: 'event1 path', settings: {} },
      { modulePath: 'rule1 path' },
      e
    );
    expect(loggerSpy.error).toHaveBeenCalledWith('error message');
  });

  describe(
    'will send a custom trigger function to ' +
      'executeDelegateModule that once called',
    function () {
      it('sends the real trigger function to guardUntilAllInitialized', function () {
        var customTrigger;

        var triggerRuleSpy = jasmine.createSpy('triggerRule');
        var executeDelegateModule = function (e, _, args) {
          customTrigger = args[0];
        };
        var normalizeSyntheticEventSpy = jasmine
          .createSpy('normalizeSyntheticEvent')
          .and.returnValue({ $type: 'some type' });
        var getErrorMessage = emptyFn;
        var getSyntheticEventMetaSpy = jasmine
          .createSpy('getSyntheticEventMeta')
          .and.returnValue({ $type: 'some type' });
        var logger = {};
        var guardUntilAllInitialized = function (cbk) {
          cbk();
        };

        var ruleEventPair = {
          rule: { modulePath: 'rule1 path' },
          event: { modulePath: 'event1 path', settings: { key: 1 } }
        };
        var syntheticEvent = {
          target: 'some target'
        };

        createInitEventModule(
          triggerRuleSpy,
          executeDelegateModule,
          normalizeSyntheticEventSpy,
          getErrorMessage,
          getSyntheticEventMetaSpy,
          logger
        )(guardUntilAllInitialized, ruleEventPair);

        customTrigger(syntheticEvent);

        expect(getSyntheticEventMetaSpy).toHaveBeenCalledWith(ruleEventPair);
        expect(normalizeSyntheticEventSpy).toHaveBeenCalledWith(
          { $type: 'some type' },
          syntheticEvent
        );

        expect(triggerRuleSpy).toHaveBeenCalledWith(
          { $type: 'some type' },
          { modulePath: 'rule1 path' }
        );
      });
    }
  );
});
