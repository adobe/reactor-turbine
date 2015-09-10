'use strict';

describe('initRules', function() {
  describe('rule execution', function() {
    var initRulesInjector = require('inject?./state!../initRules');
    var initRules;

    var state;
    var event;
    var relatedElement;
    var eventDelegates;
    var conditionDelegates;
    var actionDelegates;
    var rules;
    var propertyConfig;

    beforeEach(function() {
      event = {};
      relatedElement = {};

      eventDelegates = {
        testEvent: jasmine.createSpy().and.callFake(function(config, trigger) {
          trigger(event, relatedElement);
        })
      };

      conditionDelegates = {
        testCondition1: jasmine.createSpy().and.returnValue(true),
        testCondition2: jasmine.createSpy().and.returnValue(true)
      };

      actionDelegates = {
        testAction1: jasmine.createSpy(),
        testAction2: jasmine.createSpy()
      };

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              type: 'testEvent',
              config: {
                testEventFoo: 'bar'
              }
            }
          ],
          conditions: [
            {
              type: 'testCondition1',
              config: {
                testCondition1Foo: 'bar'
              }
            },
            {
              type:'testCondition2',
              config: {
                testCondition2Foo: 'bar'
              }
            }
          ],
          actions: [
            {
              type: 'testAction1',
              config: {
                testAction1Foo: 'bar'
              }
            },
            {
              type: 'testAction2',
              config: {
                testAction2Foo: 'bar'
              }
            }
          ]
        }
      ];

      propertyConfig = {
        propertyFoo: 'bar'
      };

      state = {
        getShouldExecuteActions: function() {
          return true;
        },
        getEventDelegate: function(type) {
          return eventDelegates[type];
        },
        getConditionDelegate: function(type) {
          return conditionDelegates[type];
        },
        getActionDelegate: function(type) {
          return actionDelegates[type];
        },
        getPropertyConfig: function() {
          return propertyConfig;
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

      expect(eventDelegates.testEvent.calls.count()).toBe(1);

      var eventDelegateCall = eventDelegates.testEvent.calls.mostRecent();

      expect(eventDelegateCall.args[0]).toEqual({
        testEventFoo: 'bar'
      });

      expect(typeof eventDelegateCall.args[1]).toBe('function');

      expect(conditionDelegates.testCondition1.calls.count()).toBe(1);

      var conditionDelegate1Call = conditionDelegates.testCondition1.calls.mostRecent();

      expect(conditionDelegate1Call.args[0]).toEqual({
        testCondition1Foo: 'bar'
      });

      expect(conditionDelegate1Call.args[1]).toBe(event);
      expect(conditionDelegate1Call.args[2]).toBe(relatedElement);

      expect(conditionDelegates.testCondition2.calls.count()).toBe(1);

      var conditionDelegate2Call = conditionDelegates.testCondition2.calls.mostRecent();

      expect(conditionDelegate2Call.args[0]).toEqual({
        testCondition2Foo: 'bar'
      });

      expect(conditionDelegate2Call.args[1]).toBe(event);
      expect(conditionDelegate2Call.args[2]).toBe(relatedElement);

      expect(actionDelegates.testAction1.calls.count()).toBe(1);

      var actionDelegate1Call = actionDelegates.testAction1.calls.mostRecent();

      expect(actionDelegate1Call.args[0]).toEqual({
        testAction1Foo: 'bar'
      });

      expect(actionDelegates.testAction2.calls.count()).toBe(1);

      var actionDelegate2Call = actionDelegates.testAction2.calls.mostRecent();

      expect(actionDelegate2Call.args[0]).toEqual({
        testAction2Foo: 'bar'
      });
    });

    it('ceases to execute remaining conditions and any actions when condition fails', function() {
      conditionDelegates.testCondition1 = jasmine.createSpy().and.returnValue(false);

      initRules();

      expect(conditionDelegates.testCondition1.calls.count()).toBe(1);
      expect(conditionDelegates.testCondition2.calls.count()).toBe(0);
      expect(actionDelegates.testAction1.calls.count()).toBe(0);
      expect(actionDelegates.testAction2.calls.count()).toBe(0);
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

      expect(actionDelegates.testAction1.calls.count()).toBe(0);
      expect(actionDelegates.testAction2.calls.count()).toBe(0);
    });
  });

  describe('logging', function() {
    var logger;
    var eventDelegate;
    var conditionDelegate;
    var actionDelegate;
    var rules;
    var initRules;

    beforeEach(function() {
      logger = {
        log: jasmine.createSpy(),
        error: jasmine.createSpy()
      };

      eventDelegate = function(config, trigger) {
        trigger();
      };

      var state = {
        getEventDelegate: function() {
          return eventDelegate;
        },
        getConditionDelegate: function() {
          return conditionDelegate;
        },
        getActionDelegate: function() {
          return actionDelegate;
        },
        getRules: function() {
          return rules;
        },
        getPropertyConfig: function() {
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
      eventDelegate = function() {
        throw new Error('noob tried to divide by zero');
      };

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              type: 'testEvent'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
          'Error when executing event listener for rule Test Rule');
    });

    it('logs an error when the event delegate is not found', function() {
      eventDelegate = null;

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              type: 'testEvent'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Event delegate of type testEvent not found.');
    });

    it('logs an error when the condition delegate throws an error', function() {
      conditionDelegate = function() {
        throw new Error('noob tried to divide by zero');
      };

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              type: 'testEvent'
            }
          ],
          conditions: [
            {
              type: 'testCondition'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
          'Error when executing condition for rule Test Rule');
    });

    it('logs an error when the condition delegate is not found', function() {
      conditionDelegate = null;

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              type: 'testEvent'
            }
          ],
          conditions: [
            {
              type: 'testCondition'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Condition delegate of type testCondition not found.');
    });

    it('logs an error when the condition doesn\'t pass', function() {
      conditionDelegate = function() {
        return false;
      };

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              type: 'testEvent'
            }
          ],
          conditions: [
            {
              type: 'testCondition'
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
      actionDelegate = function() {
        throw new Error('noob tried to divide by zero');
      };

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              type: 'testEvent'
            }
          ],
          actions: [
            {
              type: 'testAction'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
          'Error when executing action for rule Test Rule');
    });

    it('logs an error when the action delegate is not found', function() {
      actionDelegate = null;

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              type: 'testEvent'
            }
          ],
          actions: [
            {
              type: 'testAction'
            }
          ]
        }
      ];

      expect(function() {
        initRules();
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Action delegate of type testAction not found.');
    });
  });
});
