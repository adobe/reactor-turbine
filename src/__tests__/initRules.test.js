'use strict';

describe('initRules', function() {
  describe('rule execution', function() {
    var initRulesInjector = require('inject?./state!../initRules');
    var initRules;

    var state;
    var event;
    var relatedElement;
    var delegateExports;
    var rules;
    var propertySettings;

    beforeEach(function() {
      event = {};
      relatedElement = {};

      delegateExports = {
        testEvent: jasmine.createSpy().and.callFake(function(settings, trigger) {
          trigger(relatedElement, event);
        }),
        testCondition1: jasmine.createSpy().and.returnValue(true),
        testCondition2: jasmine.createSpy().and.returnValue(true),
        testAction1: jasmine.createSpy(),
        testAction2: jasmine.createSpy()
      };

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              delegateId: 'testEvent',
              settings: {
                testEventFoo: 'bar'
              }
            }
          ],
          conditions: [
            {
              delegateId: 'testCondition1',
              settings: {
                testCondition1Foo: 'bar'
              }
            },
            {
              delegateId:'testCondition2',
              settings: {
                testCondition2Foo: 'bar'
              }
            }
          ],
          actions: [
            {
              delegateId: 'testAction1',
              settings: {
                testAction1Foo: 'bar'
              }
            },
            {
              delegateId: 'testAction2',
              settings: {
                testAction2Foo: 'bar'
              }
            }
          ]
        }
      ];

      propertySettings = {
        propertyFoo: 'bar'
      };

      state = {
        getShouldExecuteActions: function() {
          return true;
        },
        getDelegate: function(delegateId) {
          return {
            displayName: 'Display Name ' + delegateId,
            exports: delegateExports[delegateId]
          };
        },
        getPropertySettings: function() {
          return propertySettings;
        },
        getRules: function() {
          return rules;
        }
      };

      initRules = initRulesInjector({
        './state': state
      });
    });

    it('evaluates all conditions and, when all pass, executes all actions', function() {
      initRules();

      expect(delegateExports.testEvent.calls.count()).toBe(1);

      var eventDelegateCall = delegateExports.testEvent.calls.mostRecent();

      expect(eventDelegateCall.args[0]).toEqual({
        testEventFoo: 'bar'
      });

      expect(typeof eventDelegateCall.args[1]).toBe('function');

      expect(delegateExports.testCondition1.calls.count()).toBe(1);

      var conditionDelegate1Call = delegateExports.testCondition1.calls.mostRecent();

      expect(conditionDelegate1Call.args[0]).toEqual({
        testCondition1Foo: 'bar'
      });

      expect(conditionDelegate1Call.args[1]).toBe(relatedElement);
      expect(conditionDelegate1Call.args[2]).toBe(event);

      expect(delegateExports.testCondition2.calls.count()).toBe(1);

      var conditionDelegate2Call = delegateExports.testCondition2.calls.mostRecent();

      expect(conditionDelegate2Call.args[0]).toEqual({
        testCondition2Foo: 'bar'
      });

      expect(conditionDelegate2Call.args[1]).toBe(relatedElement);
      expect(conditionDelegate2Call.args[2]).toBe(event);

      expect(delegateExports.testAction1.calls.count()).toBe(1);

      var actionDelegate1Call = delegateExports.testAction1.calls.mostRecent();

      expect(actionDelegate1Call.args[0]).toEqual({
        testAction1Foo: 'bar'
      });

      expect(delegateExports.testAction2.calls.count()).toBe(1);

      var actionDelegate2Call = delegateExports.testAction2.calls.mostRecent();

      expect(actionDelegate2Call.args[0]).toEqual({
        testAction2Foo: 'bar'
      });

      expect(actionDelegate2Call.args[1]).toBe(relatedElement);
      expect(actionDelegate2Call.args[2]).toBe(event);
    });

    it('ceases to execute remaining conditions and any actions when condition fails', function() {
      delegateExports.testCondition1 = jasmine.createSpy().and.returnValue(false);

      initRules();

      expect(delegateExports.testCondition1.calls.count()).toBe(1);
      expect(delegateExports.testCondition2.calls.count()).toBe(0);
      expect(delegateExports.testAction1.calls.count()).toBe(0);
      expect(delegateExports.testAction2.calls.count()).toBe(0);
    });

    it('does not throw error when there are no events for a rule', function() {
      delete rules[0].events;

      initRules();
    });

    it('does not throw error when there are no conditions for a rule', function() {
      delete rules[0].conditions;

      initRules();
    });

    it('does not throw error when there are no actions for a rule', function() {
      delete rules[0].actions;

      initRules();
    });

    it('does not execute actions when actionsEnabled is false', function() {
      state.getShouldExecuteActions = function() {
        return false;
      };

      initRules();

      expect(delegateExports.testAction1.calls.count()).toBe(0);
      expect(delegateExports.testAction2.calls.count()).toBe(0);
    });
  });

  describe('logging', function() {
    var logger;
    var delegateExports = {};
    var rules;
    var initRules;

    beforeEach(function() {
      logger = {
        log: jasmine.createSpy(),
        error: jasmine.createSpy()
      };

      delegateExports.testEvent = function(settings, trigger) {
        trigger();
      };

      var state = {
        getDelegate: function(delegateId) {
          return {
            displayName: 'Display Name ' + delegateId,
            exports: delegateExports[delegateId]
          };
        },
        getRules: function() {
          return rules;
        },
        getPropertySettings: function() {
          return null;
        },
        getShouldExecuteActions: function() {
          return true;
        }
      };

      initRules = require('inject?./utils/logger&./state!../initRules')({
        './utils/logger': logger,
        './state': state
      });
    });

    it('logs an error when the event delegate throws an error', function() {
      delegateExports.testEvent = function() {
        throw new Error('noob tried to divide by zero');
      };

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              delegateId: 'testEvent'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Error when executing Display Name testEvent event for Test Rule rule. ' +
        'Error message: noob tried to divide by zero');
    });

    it('logs an error when the event delegate is not found', function() {
      delegateExports.testEvent = null;

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              delegateId: 'testEvent'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Event delegate testEvent not found.');
    });

    it('logs an error when the condition delegate throws an error', function() {
      delegateExports.testCondition = function() {
        throw new Error('noob tried to divide by zero');
      };

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              delegateId: 'testEvent'
            }
          ],
          conditions: [
            {
              delegateId: 'testCondition'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Error when executing Display Name testCondition condition for Test Rule rule. ' +
        'Error message: noob tried to divide by zero');
    });

    it('logs an error when the condition delegate is not found', function() {
      delegateExports.testCondition = null;

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              delegateId: 'testEvent'
            }
          ],
          conditions: [
            {
              delegateId: 'testCondition'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Condition delegate testCondition not found.');
    });

    it('logs an error when the condition doesn\'t pass', function() {
      delegateExports.testCondition = function() {
        return false;
      };

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              delegateId: 'testEvent'
            }
          ],
          conditions: [
            {
              delegateId: 'testCondition'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.log.calls.mostRecent().args[0]).toEqual(
        'Condition for rule Test Rule not met.');
    });

    it('logs an error when the action delegate throws an error', function() {
      delegateExports.testAction = function() {
        throw new Error('noob tried to divide by zero');
      };

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              delegateId: 'testEvent'
            }
          ],
          actions: [
            {
              delegateId: 'testAction'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Error when executing Display Name testAction action for Test Rule rule. ' +
        'Error message: noob tried to divide by zero');
    });

    it('logs an error when the action delegate is not found', function() {
      delegateExports.testAction = null;

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              delegateId: 'testEvent'
            }
          ],
          actions: [
            {
              delegateId: 'testAction'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Action delegate testAction not found.');
    });
  });
});
