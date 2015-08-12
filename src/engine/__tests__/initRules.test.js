'use strict';

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

describe('initRules', function() {
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
