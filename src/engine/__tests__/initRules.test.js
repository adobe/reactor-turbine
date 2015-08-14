'use strict';

describe('initRules', function() {
  describe('rule execution', function() {
    var initRules = require('../initRules');

    var event;
    var relatedElement;
    var container;
    var eventDelegates;
    var eventDelegateProvider;
    var conditionDelegates;
    var conditionDelegateProvider;
    var actionDelegates;
    var actionDelegateProvider;

    beforeEach(function() {
      container = {
        extensions: {
          testExtension: {
            name: 'Test Extension'
          },
        },
        integrations: {
          abc: {
            type: 'testExtension',
            config: {
              testIntegrationFoo: 'bar'
            }
          }
        },
        rules: [
          {
            name: 'Test Rule',
            events: [
              {
                integrationIds: ['abc'],
                type: 'testEvent',
                config: {
                  testEventFoo: 'bar'
                }
              }
            ],
            conditions: [
              {
                integrationIds: ['abc'],
                type: 'testCondition1',
                config: {
                  testCondition1Foo: 'bar'
                }
              },
              {
                integrationIds: ['abc'],
                type:'testCondition2',
                config: {
                  testCondition2Foo: 'bar'
                }
              }
            ],
            actions: [
              {
                integrationIds: ['abc'],
                type: 'testAction1',
                config: {
                  testAction1Foo: 'bar'
                }
              },
              {
                integrationIds: ['abc'],
                type: 'testAction2',
                config: {
                  testAction2Foo: 'bar'
                }
              }
            ]
          }
        ],
        config: {
          propertyFoo: 'bar'
        }
      };

      event = {};
      relatedElement = {};

      eventDelegates = {
        testEvent: jasmine.createSpy().and.callFake(function(config, trigger) {
          trigger(event, relatedElement);
        })
      };

      eventDelegateProvider = {
        get: function(type) {
          return eventDelegates[type];
        }
      };

      conditionDelegates = {
        testCondition1: jasmine.createSpy().and.returnValue(true),
        testCondition2: jasmine.createSpy().and.returnValue(true)
      };

      conditionDelegateProvider = {
        get: function(type) {
          return conditionDelegates[type];
        }
      };

      actionDelegates = {
        testAction1: jasmine.createSpy(),
        testAction2: jasmine.createSpy()
      };

      actionDelegateProvider = {
        get: function(type) {
          return actionDelegates[type];
        }
      };
    });

    it('evaluates all conditions and, when all pass, executes all actions', function() {
      initRules(
        container,
        eventDelegateProvider,
        conditionDelegateProvider,
        actionDelegateProvider,
        true);

      expect(eventDelegates.testEvent.calls.count()).toBe(1);

      var eventDelegateCall = eventDelegates.testEvent.calls.mostRecent();

      expect(eventDelegateCall.args[0]).toEqual({
        eventConfig: {
          testEventFoo: 'bar'
        },
        integrationConfigs: [
          {
            testIntegrationFoo: 'bar'
          }
        ],
        propertyConfig: {
          propertyFoo: 'bar'
        }
      });

      expect(typeof eventDelegateCall.args[1]).toBe('function');

      expect(conditionDelegates.testCondition1.calls.count()).toBe(1);

      var conditionDelegate1Call = conditionDelegates.testCondition1.calls.mostRecent();

      expect(conditionDelegate1Call.args[0]).toEqual({
        conditionConfig: {
          testCondition1Foo: 'bar'
        },
        integrationConfigs: [
          {
            testIntegrationFoo: 'bar'
          }
        ],
        propertyConfig: {
          propertyFoo: 'bar'
        }
      });

      expect(conditionDelegate1Call.args[1]).toBe(event);
      expect(conditionDelegate1Call.args[2]).toBe(relatedElement);

      expect(conditionDelegates.testCondition2.calls.count()).toBe(1);

      var conditionDelegate2Call = conditionDelegates.testCondition2.calls.mostRecent();

      expect(conditionDelegate2Call.args[0]).toEqual({
        conditionConfig: {
          testCondition2Foo: 'bar'
        },
        integrationConfigs: [
          {
            testIntegrationFoo: 'bar'
          }
        ],
        propertyConfig: {
          propertyFoo: 'bar'
        }
      });

      expect(conditionDelegate2Call.args[1]).toBe(event);
      expect(conditionDelegate2Call.args[2]).toBe(relatedElement);

      expect(actionDelegates.testAction1.calls.count()).toBe(1);

      var actionDelegate1Call = actionDelegates.testAction1.calls.mostRecent();

      expect(actionDelegate1Call.args[0]).toEqual({
        actionConfig: {
          testAction1Foo: 'bar'
        },
        integrationConfigs: [
          {
            testIntegrationFoo: 'bar'
          }
        ],
        propertyConfig: {
          propertyFoo: 'bar'
        }
      });

      expect(actionDelegates.testAction2.calls.count()).toBe(1);

      var actionDelegate2Call = actionDelegates.testAction2.calls.mostRecent();

      expect(actionDelegate2Call.args[0]).toEqual({
        actionConfig: {
          testAction2Foo: 'bar'
        },
        integrationConfigs: [
          {
            testIntegrationFoo: 'bar'
          }
        ],
        propertyConfig: {
          propertyFoo: 'bar'
        }
      });
    });

    it('ceases to execute remaining conditions and any actions when condition fails', function() {
      conditionDelegates.testCondition1 = jasmine.createSpy().and.returnValue(false);

      initRules(
        container,
        eventDelegateProvider,
        conditionDelegateProvider,
        actionDelegateProvider,
        true);

      expect(conditionDelegates.testCondition1.calls.count()).toBe(1);
      expect(conditionDelegates.testCondition2.calls.count()).toBe(0);
      expect(actionDelegates.testAction1.calls.count()).toBe(0);
      expect(actionDelegates.testAction2.calls.count()).toBe(0);
    });

    it('does not throw error when there are no events for a rule', function() {
      delete container.rules[0].events;

      initRules(
        container,
        eventDelegateProvider,
        conditionDelegateProvider,
        actionDelegateProvider,
        true);
    });

    it('does not throw error when there are no conditions for a rule', function() {
      delete container.rules[0].conditions;

      initRules(
        container,
        eventDelegateProvider,
        conditionDelegateProvider,
        actionDelegateProvider,
        true);
    });

    it('does not throw error when there are no actions for a rule', function() {
      delete container.rules[0].actions;

      initRules(
        container,
        eventDelegateProvider,
        conditionDelegateProvider,
        actionDelegateProvider,
        true);
    });

    it('does not execute actions when actionsEnabled is false', function() {
      initRules(
        container,
        eventDelegateProvider,
        conditionDelegateProvider,
        actionDelegateProvider,
        false);

      expect(actionDelegates.testAction1.calls.count()).toBe(0);
      expect(actionDelegates.testAction2.calls.count()).toBe(0);
    });

    it('fills out the config argument if configs don\'t exist in the container', function() {
      delete container.integrations.abc.config;
      delete container.rules[0].events[0].config;
      delete container.rules[0].conditions[0].config;
      delete container.rules[0].actions[0].config;
      delete container.config;

      initRules(
        container,
        eventDelegateProvider,
        conditionDelegateProvider,
        actionDelegateProvider,
        true);

      var eventDelegateCall = eventDelegates.testEvent.calls.mostRecent();

      expect(eventDelegateCall.args[0]).toEqual({
        eventConfig: {},
        integrationConfigs: [{}],
        propertyConfig: {}
      });
    });
  });

  describe('logging', function() {
    var preprocessConfig = function(config) {
      return config;
    };

    var logger = {};

    var initRules = require('inject!../initRules')({
      './utils/preprocessConfig': preprocessConfig,
      './utils/logger': logger
    });

    var eventDelegatesWithImmediateTriggerCall = {
      get: function() {
        return function(config, trigger) {
          trigger();
        };
      }
    };

    beforeEach(function() {
      logger.log = jasmine.createSpy();
      logger.error = jasmine.createSpy();
    });

    it('logs an error when the event delegate throws an error', function() {
      var eventDelegates = {
        get: function() {
          return function() {
            throw new Error('noob tried to divide by zero');
          };
        }
      };

      expect(function() {
        initRules({
          rules: [
            {
              name: 'Test Rule',
              events: [
                {
                  type: 'testEvent'
                }
              ]
            }
          ]
        },
        eventDelegates);
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
          'Error when executing event listener for rule Test Rule');
    });

    it('logs an error when the event delegate is not found', function() {
      var eventDelegates = {
        get: function() {
          return null;
        }
      };

      expect(function() {
        initRules({
          rules: [
            {
              name: 'Test Rule',
              events: [
                {
                  type: 'testEvent'
                }
              ]
            }
          ]
        },
        eventDelegates);
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Event delegate of type testEvent not found.');
    });

    it('logs an error when the condition delegate throws an error', function() {
      var conditionDelegates = {
        get: function() {
          return function() {
            throw new Error('noob tried to divide by zero');
          };
        }
      };

      expect(function() {
        initRules({
          rules: [
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
          ]
        },
        eventDelegatesWithImmediateTriggerCall,
        conditionDelegates);
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
          'Error when executing condition for rule Test Rule');
    });

    it('logs an error when the condition delegate is not found', function() {
      var conditionDelegates = {
        get: function() {
          return null;
        }
      };

      expect(function() {
        initRules({
          rules: [
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
          ]
        },
        eventDelegatesWithImmediateTriggerCall,
        conditionDelegates);
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Condition delegate of type testCondition not found.');
    });

    it('logs an error when the condition doesn\'t pass', function() {
      var conditionDelegates = {
        get: function() {
          return function() {
            return false;
          };
        }
      };

      expect(function() {
        initRules({
          rules: [
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
          ]
        },
        eventDelegatesWithImmediateTriggerCall,
        conditionDelegates);
      }).not.toThrowError();

      expect(logger.log.calls.mostRecent().args[0]).toEqual(
        'Condition for rule Test Rule not met.');
    });

    it('logs an error when the action delegate throws an error', function() {
      var actionDelegates = {
        get: function() {
          return function() {
            throw new Error('noob tried to divide by zero');
          };
        }
      };

      expect(function() {
        initRules({
          rules: [
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
          ]
        },
        eventDelegatesWithImmediateTriggerCall,
        null,
        actionDelegates,
        true);
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
          'Error when executing action for rule Test Rule');
    });

    it('logs an error when the action delegate is not found', function() {
      var actionDelegates = {
        get: function() {
          return null;
        }
      };

      expect(function() {
        initRules({
          rules: [
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
          ]
        },
        eventDelegatesWithImmediateTriggerCall,
        null,
        actionDelegates,
        true);
      }).not.toThrowError();

      expect(logger.error.calls.mostRecent().args[0]).toEqual(
        'Action delegate of type testAction not found.');
    });
  });
});
