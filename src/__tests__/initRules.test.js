/***************************************************************************************
 * (c) 2017 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 ****************************************************************************************/

'use strict';
var Promise = require('@adobe/reactor-promise');
var createModuleProvider = require('../createModuleProvider');
var injectInitRules = require('inject-loader!../initRules');

describe('initRules', function() {
  var TEST_EVENT_PATH = 'hello-world/testEvent.js';
  var TEST_EVENT_NAME = 'test-event';
  var TEST_EVENT_DISPLAY_NAME = 'Test Event';

  var TEST_CONDITION1_PATH = 'hello-world/testCondition1.js';
  var TEST_CONDITION1_NAME = 'test-condition-1';
  var TEST_CONDITION1_DISPLAY_NAME = 'Test Condition 1';

  var TEST_CONDITION2_PATH = 'hello-world/testCondition2.js';
  var TEST_CONDITION2_NAME = 'test-condition-2';
  var TEST_CONDITION2_DISPLAY_NAME = 'Test Condition 2';

  var TEST_ACTION1_PATH = 'hello-world/testAction1.js';
  var TEST_ACTION1_NAME = 'test-action-1';
  var TEST_ACTION1_DISPLAY_NAME = 'Test Action 1';

  var TEST_ACTION2_PATH = 'hello-world/testAction2.js';
  var TEST_ACTION2_NAME = 'test-action-2';
  var TEST_ACTION2_DISPLAY_NAME = 'Test Action 2';

  var _satellite = {};
  var replaceTokens;
  var getShouldExecuteActions;
  var rules;
  var moduleProvider;

  beforeEach(function() {
    replaceTokens = function(value) { return value; };

    getShouldExecuteActions = function() {
      return true;
    };

    moduleProvider = createModuleProvider();
  });

  describe('rule execution', function() {
    var initRules = require('../initRules');
    var event;
    var extensionName = 'test-extension';

    beforeEach(function() {
      event = {};

      moduleProvider.registerModule(
        TEST_EVENT_PATH,
        {
          name: TEST_EVENT_NAME,
          displayName: TEST_EVENT_DISPLAY_NAME,
          script: function(module) {
            module.exports = jasmine
              .createSpy()
              .and
              .callFake(function(settings, trigger) {
                trigger(event);
              });
          }
        },
        extensionName);

      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          name: TEST_CONDITION1_NAME,
          displayName: TEST_CONDITION1_DISPLAY_NAME,
          script: function(module) {
            module.exports = jasmine.createSpy().and.returnValue(true);
          }
        },
        extensionName);

      moduleProvider.registerModule(
        TEST_CONDITION2_PATH,
        {
          name: TEST_CONDITION2_NAME,
          displayName: TEST_CONDITION2_DISPLAY_NAME,
          script: function(module) {
            module.exports = jasmine.createSpy().and.returnValue(false);
          }
        },
        extensionName);

      moduleProvider.registerModule(
        TEST_ACTION1_PATH,
        {
          name: TEST_ACTION1_NAME,
          displayName: TEST_ACTION1_DISPLAY_NAME,
          script: function(module) {
            module.exports = function() {
              return new Promise(function(resolve) {
                resolve();
              });
            };
          }
        },
        extensionName);

      moduleProvider.registerModule(
        TEST_ACTION2_PATH,
        {
          name: TEST_ACTION2_NAME,
          displayName: TEST_ACTION2_DISPLAY_NAME,
          script: function(module) {
            module.exports = jasmine.createSpy();
          }
        },
        extensionName);

      rules = [
        {
          name: 'Test Rule',
          id: 'RL123',
          events: [
            {
              modulePath: TEST_EVENT_PATH,
              settings: {
                testEventFoo: 'bar'
              }
            }
          ],
          conditions: [
            {
              modulePath: TEST_CONDITION1_PATH,
              settings: {
                testCondition1Foo: 'bar'
              }
            },
            {
              modulePath: TEST_CONDITION2_PATH,
              settings: {
                testCondition2Foo: 'bar'
              },
              negate: true
            }
          ],
          actions: [
            {
              modulePath: TEST_ACTION1_PATH,
              settings: {
                testAction1Foo: 'bar'
              }
            },
            {
              modulePath: TEST_ACTION2_PATH,
              settings: {
                testAction2Foo: 'bar'
              }
            }
          ]
        }
      ];
    });

    it('evaluates all conditions and, when all pass, executes all actions', function() {
      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      var eventExports = moduleProvider.getModuleExports(TEST_EVENT_PATH);

      expect(eventExports.calls.count()).toBe(1);

      var eventExportsCalls = eventExports.calls.mostRecent();

      expect(eventExportsCalls.args[0]).toEqual({
        testEventFoo: 'bar'
      });

      expect(typeof eventExportsCalls.args[1]).toBe('function');

      var condition1Exports = moduleProvider.getModuleExports(TEST_CONDITION1_PATH);

      expect(condition1Exports.calls.count()).toBe(1);

      var condition1ExportsCall = condition1Exports.calls.mostRecent();

      expect(condition1ExportsCall.args[0]).toEqual({
        testCondition1Foo: 'bar'
      });

      expect(condition1ExportsCall.args[1]).toEqual({
        $type: 'test-extension.test-event',
        $rule: {
          id: 'RL123',
          name: 'Test Rule'
        }
      });

      var condition2Exports = moduleProvider.getModuleExports(TEST_CONDITION2_PATH);

      expect(condition2Exports.calls.count()).toBe(1);

      var condition2ExportsCall = condition2Exports.calls.mostRecent();

      expect(condition2ExportsCall.args[0]).toEqual({
        testCondition2Foo: 'bar'
      });

      expect(condition2ExportsCall.args[1]).toEqual({
        $type: 'test-extension.test-event',
        $rule: {
          id: 'RL123',
          name: 'Test Rule'
        }
      });

      var action1Exports = moduleProvider.getModuleExports(TEST_ACTION1_PATH);

      expect(action1Exports.calls.count()).toBe(1);

      var action1ExportsCall = action1Exports.calls.mostRecent();

      expect(action1ExportsCall.args[0]).toEqual({
        testAction1Foo: 'bar'
      });

      expect(action1ExportsCall.args[1]).toEqual({
        $type: 'test-extension.test-event',
        $rule: {
          id: 'RL123',
          name: 'Test Rule'
        }
      });

      var action2Exports = moduleProvider.getModuleExports(TEST_ACTION2_PATH);

      expect(action2Exports.calls.count()).toBe(1);

      var action2ExportsCall = action2Exports.calls.mostRecent();

      expect(action2ExportsCall.args[0]).toEqual({
        testAction2Foo: 'bar'
      });

      expect(action2ExportsCall.args[1]).toEqual({
        $type: 'test-extension.test-event',
        $rule: {
          id: 'RL123',
          name: 'Test Rule'
        }
      });
    });

    it('ceases to execute remaining conditions and any actions when condition fails', function() {
      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          name: TEST_CONDITION1_NAME,
          displayName: TEST_CONDITION1_DISPLAY_NAME,
          script: function(module) {
            module.exports = jasmine.createSpy().and.returnValue(false);
          }
        }
      );

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      expect(moduleProvider.getModuleExports(TEST_CONDITION1_PATH).calls.count()).toBe(1);
      expect(moduleProvider.getModuleExports(TEST_CONDITION2_PATH).calls.count()).toBe(0);
      expect(moduleProvider.getModuleExports(TEST_ACTION1_PATH).calls.count()).toBe(0);
      expect(moduleProvider.getModuleExports(TEST_ACTION2_PATH).calls.count()).toBe(0);
    });

    it('ceases to execute remaining conditions and any actions when negated ' +
      'condition fails', function() {
      rules[0].conditions[0].negate = true;

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      expect(moduleProvider.getModuleExports(TEST_CONDITION1_PATH).calls.count()).toBe(1);
      expect(moduleProvider.getModuleExports(TEST_CONDITION2_PATH).calls.count()).toBe(0);
      expect(moduleProvider.getModuleExports(TEST_ACTION1_PATH).calls.count()).toBe(0);
      expect(moduleProvider.getModuleExports(TEST_ACTION2_PATH).calls.count()).toBe(0);
    });

    it('does not throw error when there are no events for a rule', function() {
      delete rules[0].events;

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
    });

    it('does not throw error when there are no conditions for a rule', function() {
      delete rules[0].conditions;

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
    });

    it('does not throw error when there are no actions for a rule', function() {
      delete rules[0].actions;

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
    });

    it('does not execute actions when actionsEnabled is false', function() {
      getShouldExecuteActions = function() {
        return false;
      };

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      expect(moduleProvider.getModuleExports(TEST_ACTION1_PATH).calls.count()).toBe(0);
      expect(moduleProvider.getModuleExports(TEST_ACTION2_PATH).calls.count()).toBe(0);
    });
  });

  describe('error handling and logging', function() {
    var logger;
    var initRules;

    beforeEach(function() {
      logger = jasmine.createSpyObj('logger', ['log', 'error']);

      moduleProvider.registerModule(
        TEST_EVENT_PATH,
        {
          name: TEST_EVENT_NAME,
          displayName: TEST_EVENT_DISPLAY_NAME,
          script: function(module) {
            module.exports = function(settings, trigger) { trigger(); };
          }
        });

      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          name: TEST_CONDITION1_NAME,
          displayName: TEST_CONDITION1_DISPLAY_NAME,
          script: function(module) {
            module.exports = function() { return true; };
          }
        });

      moduleProvider.registerModule(
        TEST_ACTION1_PATH,
        {
          name: TEST_ACTION1_NAME,
          displayName: TEST_ACTION2_DISPLAY_NAME,
          script: function(module) {
            module.exports = function() {};
          }
        }
      );

      rules = [
        {
          name: 'Test Rule',
          events: [
            {
              modulePath: TEST_EVENT_PATH
            }
          ],
          conditions: [
            {
              modulePath: TEST_CONDITION1_PATH
            }
          ],
          actions: [
            {
              modulePath: TEST_ACTION1_PATH
            }
          ]
        }
      ];

      initRules = injectInitRules({
        './logger': logger
      });
    });

    it('logs an error when retrieving event module exports fails', function() {
      moduleProvider.registerModule(
        TEST_EVENT_PATH,
        {
          name: TEST_EVENT_NAME,
          displayName: TEST_EVENT_DISPLAY_NAME,
          script: function() {
            throw new Error('noob tried to divide by zero.');
          }
        });

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' +
        TEST_EVENT_DISPLAY_NAME + ' for Test Rule rule. noob tried to divide by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });

    it('logs an error when the event module exports is not a function', function() {
      moduleProvider.registerModule(
        TEST_EVENT_PATH,
        {
          name: TEST_EVENT_NAME,
          displayName: TEST_EVENT_DISPLAY_NAME,
          script: function(module) {
            module.exports = {};
          }
        }
      );

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toBe('Failed to execute ' + TEST_EVENT_DISPLAY_NAME +
        ' for Test Rule rule. Module did not export a function.');
    });

    it('logs an error when executing event module exports fails', function() {
      moduleProvider.registerModule(
        TEST_EVENT_PATH,
        {
          name: TEST_EVENT_NAME,
          displayName: TEST_EVENT_DISPLAY_NAME,
          script: function(module) {
            module.exports = function() {
              throw new Error('noob tried to divide by zero.');
            };
          }
        }
      );

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' + TEST_EVENT_DISPLAY_NAME +
        ' for Test Rule rule. noob tried to divide by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });

    it('logs an error when retrieving condition module exports fails', function() {
      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          name: TEST_CONDITION1_NAME,
          displayName: TEST_CONDITION1_DISPLAY_NAME,
          script: function() {
            throw new Error('noob tried to divide by zero.');
          }
        }
      );

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' + TEST_CONDITION1_DISPLAY_NAME +
        ' for Test Rule rule. noob tried to divide by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });

    it('logs an error when the condition module exports is not a function', function() {
      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          name: TEST_CONDITION1_NAME,
          displayName: TEST_CONDITION1_DISPLAY_NAME,
          script: function(module) {
            module.exports = {};
          }
        }
      );

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toBe('Failed to execute ' + TEST_CONDITION1_DISPLAY_NAME +
        ' for Test Rule rule. Module did not export a function.');
    });

    it('logs an error when executing condition module exports fails', function() {
      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          name: TEST_CONDITION1_NAME,
          displayName: TEST_CONDITION1_DISPLAY_NAME,
          script: function(module) {
            module.exports = function() {
              throw new Error('noob tried to divide by zero.');
            };
          }
        }
      );

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' + TEST_CONDITION1_DISPLAY_NAME +
        ' for Test Rule rule. noob tried to divide by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });

    it('logs a message when the condition doesn\'t pass', function() {
      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          name: TEST_CONDITION1_NAME,
          displayName: TEST_CONDITION1_DISPLAY_NAME,
          script: function(module) {
            module.exports = function() {
              return false;
            };
          }
        }
      );

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      expect(logger.log.calls.mostRecent().args[0]).toEqual(
        'Condition ' + TEST_CONDITION1_DISPLAY_NAME + ' for rule Test Rule not met.');
    });

    it('logs a message when the negated condition doesn\'t pass', function() {
      rules[0].conditions[0].negate = true;

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      expect(logger.log.calls.mostRecent().args[0]).toEqual(
        'Condition ' + TEST_CONDITION1_DISPLAY_NAME + ' for rule Test Rule not met.');
    });

    it('logs an error when retrieving action module exports fails', function() {
      moduleProvider.registerModule(
        TEST_ACTION1_PATH,
        {
          name: TEST_ACTION1_NAME,
          displayName: TEST_ACTION1_DISPLAY_NAME,
          script: function() {
            throw new Error('noob tried to divide by zero.');
          }
        });

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' +
        TEST_ACTION1_DISPLAY_NAME + ' for Test Rule rule. noob tried to divide ' +
        'by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });

    it('logs an error when the action module exports is not a function', function() {
      moduleProvider.registerModule(
        TEST_ACTION1_PATH,
        {
          name: TEST_ACTION1_NAME,
          displayName: TEST_ACTION1_DISPLAY_NAME,
          script: function(module) {
            module.exports = {};
          }
        }
      );

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toBe('Failed to execute ' + TEST_ACTION1_DISPLAY_NAME +
        ' for Test Rule rule. Module did not export a function.');
    });

    it('logs an error when executing action module exports fails', function() {
      moduleProvider.registerModule(
        TEST_ACTION1_PATH,
        {
          name: TEST_ACTION1_NAME,
          displayName: TEST_ACTION1_DISPLAY_NAME,
          script: function(module) {
            module.exports = function() {
              throw new Error('noob tried to divide by zero.');
            };
          }
        }
      );

      initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' + TEST_ACTION1_DISPLAY_NAME +
        ' for Test Rule rule. noob tried to divide by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });
  });

  // describe('async action processing', function() {
  //   var logger;
  //   var initRules;
  //
  //   beforeEach(function() {
  //     logger = jasmine.createSpyObj('logger', ['log', 'error']);
  //
  //     moduleProvider.registerModule(
  //       TEST_EVENT_PATH,
  //       {
  //         name: TEST_EVENT_NAME,
  //         displayName: TEST_EVENT_DISPLAY_NAME,
  //         script: function(module) {
  //           module.exports = function(settings, trigger) { trigger(); };
  //         }
  //       });
  //
  //     moduleProvider.registerModule(
  //       TEST_ACTION1_PATH,
  //       {
  //         name: TEST_ACTION1_NAME,
  //         displayName: TEST_ACTION2_DISPLAY_NAME,
  //         script: function(module) {
  //           module.exports = new Promise(function(resolve, reject) {
  //
  //           });
  //         }
  //       }
  //     );
  //
  //     rules = [
  //       {
  //         name: 'Test Rule',
  //         events: [
  //           {
  //             modulePath: TEST_EVENT_PATH
  //           }
  //         ],
  //         actions: [
  //           {
  //             modulePath: TEST_ACTION1_PATH
  //           }
  //         ]
  //       }
  //     ];
  //
  //     initRules = injectInitRules({
  //       './logger': logger
  //     });
  //   });
  //
  //   it('logs an error when retrieving event module exports fails', function() {
  //     moduleProvider.registerModule(
  //       TEST_EVENT_PATH,
  //       {
  //         name: TEST_EVENT_NAME,
  //         displayName: TEST_EVENT_DISPLAY_NAME,
  //         script: function() {
  //           throw new Error('noob tried to divide by zero.');
  //         }
  //       });
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     var errorMessage = logger.error.calls.mostRecent().args[0];
  //     var expectedErrorMessage = 'Failed to execute ' +
  //       TEST_EVENT_DISPLAY_NAME + ' for Test Rule rule. noob tried to divide by zero.';
  //     expect(errorMessage).toStartWith(expectedErrorMessage);
  //   });
  //
  //   it('logs an error when the event module exports is not a function', function() {
  //     moduleProvider.registerModule(
  //       TEST_EVENT_PATH,
  //       {
  //         name: TEST_EVENT_NAME,
  //         displayName: TEST_EVENT_DISPLAY_NAME,
  //         script: function(module) {
  //           module.exports = {};
  //         }
  //       }
  //     );
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     var errorMessage = logger.error.calls.mostRecent().args[0];
  //     expect(errorMessage).toBe('Failed to execute ' + TEST_EVENT_DISPLAY_NAME +
  //       ' for Test Rule rule. Module did not export a function.');
  //   });
  //
  //   it('logs an error when executing event module exports fails', function() {
  //     moduleProvider.registerModule(
  //       TEST_EVENT_PATH,
  //       {
  //         name: TEST_EVENT_NAME,
  //         displayName: TEST_EVENT_DISPLAY_NAME,
  //         script: function(module) {
  //           module.exports = function() {
  //             throw new Error('noob tried to divide by zero.');
  //           };
  //         }
  //       }
  //     );
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     var errorMessage = logger.error.calls.mostRecent().args[0];
  //     var expectedErrorMessage = 'Failed to execute ' + TEST_EVENT_DISPLAY_NAME +
  //       ' for Test Rule rule. noob tried to divide by zero.';
  //     expect(errorMessage).toStartWith(expectedErrorMessage);
  //   });
  //
  //   it('logs an error when retrieving condition module exports fails', function() {
  //     moduleProvider.registerModule(
  //       TEST_CONDITION1_PATH,
  //       {
  //         name: TEST_CONDITION1_NAME,
  //         displayName: TEST_CONDITION1_DISPLAY_NAME,
  //         script: function() {
  //           throw new Error('noob tried to divide by zero.');
  //         }
  //       }
  //     );
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     var errorMessage = logger.error.calls.mostRecent().args[0];
  //     var expectedErrorMessage = 'Failed to execute ' + TEST_CONDITION1_DISPLAY_NAME +
  //       ' for Test Rule rule. noob tried to divide by zero.';
  //     expect(errorMessage).toStartWith(expectedErrorMessage);
  //   });
  //
  //   it('logs an error when the condition module exports is not a function', function() {
  //     moduleProvider.registerModule(
  //       TEST_CONDITION1_PATH,
  //       {
  //         name: TEST_CONDITION1_NAME,
  //         displayName: TEST_CONDITION1_DISPLAY_NAME,
  //         script: function(module) {
  //           module.exports = {};
  //         }
  //       }
  //     );
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     var errorMessage = logger.error.calls.mostRecent().args[0];
  //     expect(errorMessage).toBe('Failed to execute ' + TEST_CONDITION1_DISPLAY_NAME +
  //       ' for Test Rule rule. Module did not export a function.');
  //   });
  //
  //   it('logs an error when executing condition module exports fails', function() {
  //     moduleProvider.registerModule(
  //       TEST_CONDITION1_PATH,
  //       {
  //         name: TEST_CONDITION1_NAME,
  //         displayName: TEST_CONDITION1_DISPLAY_NAME,
  //         script: function(module) {
  //           module.exports = function() {
  //             throw new Error('noob tried to divide by zero.');
  //           };
  //         }
  //       }
  //     );
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     var errorMessage = logger.error.calls.mostRecent().args[0];
  //     var expectedErrorMessage = 'Failed to execute ' + TEST_CONDITION1_DISPLAY_NAME +
  //       ' for Test Rule rule. noob tried to divide by zero.';
  //     expect(errorMessage).toStartWith(expectedErrorMessage);
  //   });
  //
  //   it('logs a message when the condition doesn\'t pass', function() {
  //     moduleProvider.registerModule(
  //       TEST_CONDITION1_PATH,
  //       {
  //         name: TEST_CONDITION1_NAME,
  //         displayName: TEST_CONDITION1_DISPLAY_NAME,
  //         script: function(module) {
  //           module.exports = function() {
  //             return false;
  //           };
  //         }
  //       }
  //     );
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     expect(logger.log.calls.mostRecent().args[0]).toEqual(
  //       'Condition ' + TEST_CONDITION1_DISPLAY_NAME + ' for rule Test Rule not met.');
  //   });
  //
  //   it('logs a message when the negated condition doesn\'t pass', function() {
  //     rules[0].conditions[0].negate = true;
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     expect(logger.log.calls.mostRecent().args[0]).toEqual(
  //       'Condition ' + TEST_CONDITION1_DISPLAY_NAME + ' for rule Test Rule not met.');
  //   });
  //
  //   it('logs an error when retrieving action module exports fails', function() {
  //     moduleProvider.registerModule(
  //       TEST_ACTION1_PATH,
  //       {
  //         name: TEST_ACTION1_NAME,
  //         displayName: TEST_ACTION1_DISPLAY_NAME,
  //         script: function() {
  //           throw new Error('noob tried to divide by zero.');
  //         }
  //       });
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     var errorMessage = logger.error.calls.mostRecent().args[0];
  //     var expectedErrorMessage = 'Failed to execute ' +
  //       TEST_ACTION1_DISPLAY_NAME + ' for Test Rule rule. noob tried to divide ' +
  //       'by zero.';
  //     expect(errorMessage).toStartWith(expectedErrorMessage);
  //   });
  //
  //   it('logs an error when the action module exports is not a function', function() {
  //     moduleProvider.registerModule(
  //       TEST_ACTION1_PATH,
  //       {
  //         name: TEST_ACTION1_NAME,
  //         displayName: TEST_ACTION1_DISPLAY_NAME,
  //         script: function(module) {
  //           module.exports = {};
  //         }
  //       }
  //     );
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     var errorMessage = logger.error.calls.mostRecent().args[0];
  //     expect(errorMessage).toBe('Failed to execute ' + TEST_ACTION1_DISPLAY_NAME +
  //       ' for Test Rule rule. Module did not export a function.');
  //   });
  //
  //   it('logs an error when executing action module exports fails', function() {
  //     moduleProvider.registerModule(
  //       TEST_ACTION1_PATH,
  //       {
  //         name: TEST_ACTION1_NAME,
  //         displayName: TEST_ACTION1_DISPLAY_NAME,
  //         script: function(module) {
  //           module.exports = function() {
  //             throw new Error('noob tried to divide by zero.');
  //           };
  //         }
  //       }
  //     );
  //
  //     initRules(_satellite, rules, moduleProvider, replaceTokens, getShouldExecuteActions);
  //
  //     var errorMessage = logger.error.calls.mostRecent().args[0];
  //     var expectedErrorMessage = 'Failed to execute ' + TEST_ACTION1_DISPLAY_NAME +
  //       ' for Test Rule rule. noob tried to divide by zero.';
  //     expect(errorMessage).toStartWith(expectedErrorMessage);
  //   });
  // });
});
