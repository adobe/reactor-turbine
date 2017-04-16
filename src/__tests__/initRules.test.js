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

var getMockDisplayName = function(referencePath) {
  return 'Display Name ' + referencePath;
};

describe('initRules', function() {
  var createModuleProvider = require('inject-loader?!../moduleProvider');
  var TEST_EVENT_PATH = 'hello-world/testEvent.js';
  var TEST_CONDITION1_PATH = 'hello-world/testCondition1.js';
  var TEST_CONDITION2_PATH = 'hello-world/testCondition2.js';
  var TEST_ACTION1_PATH = 'hello-world/testAction1.js';
  var TEST_ACTION2_PATH = 'hello-world/testAction2.js';

  describe('rule execution', function() {
    var injectInitRules = require('inject-loader?./state!../initRules');
    var initRules;

    var state;
    var event;
    var relatedElement;
    var rules;
    var propertySettings;
    var moduleProvider;

    beforeEach(function() {
      event = {};
      relatedElement = {};

      moduleProvider = createModuleProvider();

      moduleProvider.registerModule(
        TEST_EVENT_PATH,
        {
          displayName: getMockDisplayName(TEST_EVENT_PATH),
          script: function(module) {
            module.exports = jasmine
              .createSpy()
              .and
              .callFake(function(settings, trigger) {
                trigger(relatedElement, event);
              });
          }
        });

      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          displayName: getMockDisplayName(TEST_CONDITION1_PATH),
          script: function(module) {
            module.exports = jasmine.createSpy().and.returnValue(true);
          }
        });

      moduleProvider.registerModule(
        TEST_CONDITION2_PATH,
        {
          displayName: getMockDisplayName(TEST_CONDITION2_PATH),
          script: function(module) {
            module.exports = jasmine.createSpy().and.returnValue(false);
          }
        });

      moduleProvider.registerModule(
        TEST_ACTION1_PATH,
        {
          displayName: getMockDisplayName(TEST_ACTION1_PATH),
          script: function(module) {
            module.exports = jasmine.createSpy();
          }
        });

      moduleProvider.registerModule(
        TEST_ACTION2_PATH,
        {
          displayName: getMockDisplayName(TEST_ACTION2_PATH),
          script: function(module) {
            module.exports = jasmine.createSpy();
          }
        });

      rules = [
        {
          name: 'Test Rule',
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
              logicType: 'exception'
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

      propertySettings = {
        propertyFoo: 'bar'
      };

      state = {
        getShouldExecuteActions: function() {
          return true;
        },
        getModuleExports: moduleProvider.getModuleExports,
        getModuleDisplayName: moduleProvider.getModuleDisplayName,
        getPropertySettings: function() {
          return propertySettings;
        },
        getRules: function() {
          return rules;
        }
      };

      initRules = injectInitRules({
        './state': state
      });
    });

    it('evaluates all conditions and, when all pass, executes all actions', function() {
      initRules();

      var eventExports = moduleProvider.getModuleExports(TEST_EVENT_PATH);

      expect(eventExports.calls.count()).toBe(1);

      var eventExportsCalls = eventExports.calls.mostRecent();

      expect(eventExportsCalls.args[0]).toEqual({
        testEventFoo: 'bar'
      });

      expect(typeof eventExportsCalls.args[1]).toBe('function');

      var condition1Exports = moduleProvider.getModuleExports(TEST_CONDITION1_PATH);

      expect(condition1Exports.calls.count()).toBe(1);

      var condiiton1ExportsCall = condition1Exports.calls.mostRecent();

      expect(condiiton1ExportsCall.args[0]).toEqual({
        testCondition1Foo: 'bar'
      });

      expect(condiiton1ExportsCall.args[1]).toBe(relatedElement);
      expect(condiiton1ExportsCall.args[2]).toBe(event);

      var condition2Exports = moduleProvider.getModuleExports(TEST_CONDITION2_PATH);

      expect(condition2Exports.calls.count()).toBe(1);

      var condition2ExportsCall = condition2Exports.calls.mostRecent();

      expect(condition2ExportsCall.args[0]).toEqual({
        testCondition2Foo: 'bar'
      });

      expect(condition2ExportsCall.args[1]).toBe(relatedElement);
      expect(condition2ExportsCall.args[2]).toBe(event);

      var action1Exports = moduleProvider.getModuleExports(TEST_ACTION1_PATH);

      expect(action1Exports.calls.count()).toBe(1);

      var action1ExportsCall = action1Exports.calls.mostRecent();

      expect(action1ExportsCall.args[0]).toEqual({
        testAction1Foo: 'bar'
      });

      expect(action1ExportsCall.args[1]).toBe(relatedElement);
      expect(action1ExportsCall.args[2]).toBe(event);

      var action2Exports = moduleProvider.getModuleExports(TEST_ACTION2_PATH);

      expect(action2Exports.calls.count()).toBe(1);

      var action2ExportsCall = action2Exports.calls.mostRecent();

      expect(action2ExportsCall.args[0]).toEqual({
        testAction2Foo: 'bar'
      });

      expect(action2ExportsCall.args[1]).toBe(relatedElement);
      expect(action2ExportsCall.args[2]).toBe(event);
    });

    it('ceases to execute remaining conditions and any actions when condition fails', function() {
      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          displayName: getMockDisplayName(TEST_CONDITION1_PATH),
          script: function(module) {
            module.exports = jasmine.createSpy().and.returnValue(false);
          }
        }
      );

      initRules();

      expect(moduleProvider.getModuleExports(TEST_CONDITION1_PATH).calls.count()).toBe(1);
      expect(moduleProvider.getModuleExports(TEST_CONDITION2_PATH).calls.count()).toBe(0);
      expect(moduleProvider.getModuleExports(TEST_ACTION1_PATH).calls.count()).toBe(0);
      expect(moduleProvider.getModuleExports(TEST_ACTION2_PATH).calls.count()).toBe(0);
    });

    it('ceases to execute remaining conditions and any actions when exception ' +
      'condition fails', function() {
      rules[0].conditions[0].logicType = 'exception';

      initRules();

      expect(moduleProvider.getModuleExports(TEST_CONDITION1_PATH).calls.count()).toBe(1);
      expect(moduleProvider.getModuleExports(TEST_CONDITION2_PATH).calls.count()).toBe(0);
      expect(moduleProvider.getModuleExports(TEST_ACTION1_PATH).calls.count()).toBe(0);
      expect(moduleProvider.getModuleExports(TEST_ACTION2_PATH).calls.count()).toBe(0);
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

      expect(moduleProvider.getModuleExports(TEST_ACTION1_PATH).calls.count()).toBe(0);
      expect(moduleProvider.getModuleExports(TEST_ACTION2_PATH).calls.count()).toBe(0);
    });
  });

  describe('error handling and logging', function() {
    var logger;
    var initRules;
    var rules;
    var state;
    var moduleProvider;

    beforeEach(function() {
      logger = jasmine.createSpyObj('logger', ['log', 'error']);
      moduleProvider = createModuleProvider();

      moduleProvider.registerModule(
        TEST_EVENT_PATH,
        {
          displayName: getMockDisplayName(TEST_EVENT_PATH),
          script: function(module) {
            module.exports = function(settings, trigger) { trigger(); };
          }
        });

      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          displayName: getMockDisplayName(TEST_CONDITION1_PATH),
          script: function(module) {
            module.exports = function() { return true; };
          }
        });

      moduleProvider.registerModule(
        TEST_ACTION1_PATH,
        {
          displayName: getMockDisplayName(TEST_ACTION1_PATH),
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

      state = {
        getModuleExports: moduleProvider.getModuleExports,
        getModuleDisplayName: moduleProvider.getModuleDisplayName,
        getRules: function() {
          return rules;
        },
        getShouldExecuteActions: function() {
          return true;
        }
      };

      initRules = require('inject-loader?./logger&./state!../initRules')({
        './logger': logger,
        './state': state
      });
    });

    it('logs an error when retrieving event module exports fails', function() {
      moduleProvider.registerModule(
        TEST_EVENT_PATH,
        {
          displayName: getMockDisplayName(TEST_EVENT_PATH),
          script: function() {
            throw new Error('noob tried to divide by zero.');
          }
        });

      initRules();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' +
        getMockDisplayName(TEST_EVENT_PATH) + ' for Test Rule rule. noob tried to divide by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });

    it('logs an error when the event module exports is not a function', function() {
      moduleProvider.registerModule(
        TEST_EVENT_PATH,
        {
          displayName: getMockDisplayName(TEST_EVENT_PATH),
          script: function(module) {
            module.exports = {};
          }
        }
      );

      initRules();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toBe('Failed to execute ' + getMockDisplayName(TEST_EVENT_PATH) +
        ' for Test Rule rule. Module did not export a function.');
    });

    it('logs an error when executing event module exports fails', function() {
      moduleProvider.registerModule(
        TEST_EVENT_PATH,
        {
          displayName: getMockDisplayName(TEST_EVENT_PATH),
          script: function(module) {
            module.exports = function() {
              throw new Error('noob tried to divide by zero.');
            };
          }
        }
      );

      initRules();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' + getMockDisplayName(TEST_EVENT_PATH) +
        ' for Test Rule rule. noob tried to divide by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });

    it('logs an error when retrieving condition module exports fails', function() {
      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          displayName: getMockDisplayName(TEST_CONDITION1_PATH),
          script: function() {
            throw new Error('noob tried to divide by zero.');
          }
        }
      );

      initRules();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' + getMockDisplayName(TEST_CONDITION1_PATH) +
        ' for Test Rule rule. noob tried to divide by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });

    it('logs an error when the condition module exports is not a function', function() {
      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          displayName: getMockDisplayName(TEST_CONDITION1_PATH),
          script: function(module) {
            module.exports = {};
          }
        }
      );

      initRules();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toBe('Failed to execute ' + getMockDisplayName(TEST_CONDITION1_PATH) +
        ' for Test Rule rule. Module did not export a function.');
    });

    it('logs an error when executing condition module exports fails', function() {
      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          displayName: getMockDisplayName(TEST_CONDITION1_PATH),
          script: function(module) {
            module.exports = function() {
              throw new Error('noob tried to divide by zero.');
            };
          }
        }
      );

      initRules();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' + getMockDisplayName(TEST_CONDITION1_PATH) +
        ' for Test Rule rule. noob tried to divide by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });

    it('logs a message when the condition doesn\'t pass', function() {
      moduleProvider.registerModule(
        TEST_CONDITION1_PATH,
        {
          displayName: getMockDisplayName(TEST_CONDITION1_PATH),
          script: function(module) {
            module.exports = function() {
              return false;
            };
          }
        }
      );

      initRules();

      expect(logger.log.calls.mostRecent().args[0]).toEqual(
        'Condition Display Name hello-world/testCondition1.js for rule Test Rule not met.');
    });

    it('logs a message when the exception condition doesn\'t pass', function() {
      rules[0].conditions[0].logicType = 'exception';

      initRules();

      expect(logger.log.calls.mostRecent().args[0]).toEqual(
        'Condition Display Name hello-world/testCondition1.js for rule Test Rule not met.');
    });

    it('logs an error when retrieving action module exports fails', function() {
      moduleProvider.registerModule(
        TEST_ACTION1_PATH,
        {
          displayName: getMockDisplayName(TEST_ACTION1_PATH),
          script: function() {
            throw new Error('noob tried to divide by zero.');
          }
        });

      initRules();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' +
        getMockDisplayName(TEST_ACTION1_PATH) + ' for Test Rule rule. noob tried to divide ' +
        'by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });

    it('logs an error when the action module exports is not a function', function() {
      moduleProvider.registerModule(
        TEST_ACTION1_PATH,
        {
          displayName: getMockDisplayName(TEST_ACTION1_PATH),
          script: function(module) {
            module.exports = {};
          }
        }
      );

      initRules();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      expect(errorMessage).toBe('Failed to execute ' + getMockDisplayName(TEST_ACTION1_PATH) +
        ' for Test Rule rule. Module did not export a function.');
    });

    it('logs an error when executing action module exports fails', function() {
      moduleProvider.registerModule(
        TEST_ACTION1_PATH,
        {
          displayName: getMockDisplayName(TEST_ACTION1_PATH),
          script: function(module) {
            module.exports = function() {
              throw new Error('noob tried to divide by zero.');
            };
          }
        }
      );

      initRules();

      var errorMessage = logger.error.calls.mostRecent().args[0];
      var expectedErrorMessage = 'Failed to execute ' + getMockDisplayName(TEST_ACTION1_PATH) +
        ' for Test Rule rule. noob tried to divide by zero.';
      expect(errorMessage).toStartWith(expectedErrorMessage);
    });
  });
});
