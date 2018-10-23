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
var createModuleProvider = require('../createModuleProvider');
var injectInitRules = require('inject-loader!../initRules');
var ModuleHelper = require('./helpers/module');

var generateDelegate = function(name, scriptFn, settings) {
  return {
    name: name || 'Event',
    settings: settings,
    script:
      scriptFn ||
      function(module) {
        module.exports = jasmine
          .createSpy()
          .and.callFake(function(settings, trigger) {
            trigger(event);
          });
      }
  };
};

var generateEvent = generateDelegate;
var generateCondition = generateDelegate;
var generateAction = generateDelegate;

var setupRules = function(rulesDefinition) {
  var rules = [];
  var counter = 1;

  rulesDefinition.forEach(function(ruleDefinition) {
    var rule = {
      name: 'Test Rule ' + counter,
      id: 'RL' + counter
    };

    // If we don't setup an event, generate automatically one that will be called.
    if (!ruleDefinition.events) {
      ruleDefinition.events = [generateEvent('ImpliedEvent')];
    }

    ['events', 'conditions', 'actions'].forEach(function(delegateType) {
      rule[delegateType] = [];

      (ruleDefinition[delegateType] || []).forEach(function(
        delegateDefinition
      ) {
        moduleProvider.registerModule.apply(
          null,
          ModuleHelper.createModule(
            delegateDefinition.name,
            delegateDefinition.script
          )
        );

        var delegate = {
          modulePath: ModuleHelper.getPath(delegateDefinition.name),
          settings: delegateDefinition.settings
        };

        if (
          delegateType === 'conditions' &&
          delegateDefinition.negate != null
        ) {
          delegate.negate = delegateDefinition.negate;
        }

        rule[delegateType].push(delegate);
      });
    });

    rules.push(rule);
    counter += 1;
  });

  return rules;
};

var runInitRules = function(rules) {
  return initRules(
    _satellite,
    rules,
    moduleProvider,
    replaceTokens,
    getShouldExecuteActions
  );
};

var _satellite = {};
var replaceTokens = function(value) {
  return value;
};
var getShouldExecuteActions;
var moduleProvider;
var initRules;
var notifyMonitors;
var logger;

describe('initRules', function() {
  beforeEach(function() {
    getShouldExecuteActions = function() {
      return true;
    };

    moduleProvider = createModuleProvider();

    initRules = injectInitRules({
      './createNotifyMonitors': function() {
        notifyMonitors = jasmine.createSpy();
        return notifyMonitors;
      }
    });
  });

  describe('when not queue local storage flag is set', function() {
    describe('rule execution', function() {
      it('executes the rule event', function() {
        var rules = setupRules([
          {
            events: [generateEvent('Event1')]
          }
        ]);

        runInitRules(rules);

        var eventExports = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Event1')
        );
        expect(eventExports.calls.count()).toBe(1);
      });

      it('calls the rule event with the provided settings', function() {
        var rules = setupRules([
          {
            events: [
              generateEvent(
                'Event1',
                function(module) {
                  module.exports = jasmine.createSpy();
                },
                {
                  testEvent1Foo: 1
                }
              )
            ]
          }
        ]);

        runInitRules(rules);

        var eventExports = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Event1')
        );
        var eventExportsCall = eventExports.calls.mostRecent();

        expect(eventExportsCall.args[0]).toEqual({
          testEvent1Foo: 1
        });
      });

      it('executes the rule condition', function() {
        var rules = setupRules([
          {
            conditions: [generateCondition('Condition1')]
          }
        ]);

        runInitRules(rules);

        var conditionExport = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Condition1')
        );
        expect(conditionExport.calls.count()).toBe(1);
      });

      it('calls the rule condition with the provided settings', function() {
        var rules = setupRules([
          {
            conditions: [
              generateCondition(
                'Condition1',
                function(module) {
                  module.exports = jasmine.createSpy();
                },
                {
                  testCondition1Foo: 1
                }
              )
            ]
          }
        ]);

        runInitRules(rules);

        var conditionExport = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Condition1')
        );
        var conditionExportsCall = conditionExport.calls.mostRecent();

        expect(conditionExportsCall.args[0]).toEqual({
          testCondition1Foo: 1
        });
      });

      it('executes all the rule conditions provided', function() {
        var rules = setupRules([
          {
            conditions: [
              generateCondition('Condition1', function(module) {
                module.exports = jasmine.createSpy().and.returnValue(true);
              }),
              generateCondition('Condition2')
            ]
          }
        ]);

        runInitRules(rules);

        var conditionExport1 = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Condition1')
        );
        var conditionExport2 = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Condition2')
        );

        expect(conditionExport1.calls.count()).toBe(1);
        expect(conditionExport2.calls.count()).toBe(1);
      });

      it('executes all the rule conditions in the order provided', function() {
        var callOrder = [];
        var rules = setupRules([
          {
            conditions: [
              generateCondition('Condition1', function(module) {
                callOrder.push('Condition1');
                module.exports = jasmine.createSpy().and.returnValue(true);
              }),
              generateCondition('Condition2', function(module) {
                callOrder.push('Condition2');
                module.exports = jasmine.createSpy().and.returnValue(true);
              })
            ]
          }
        ]);

        runInitRules(rules);

        expect(callOrder).toEqual(['Condition1', 'Condition2']);
      });

      it('executes the rule action', function() {
        var rules = setupRules([
          {
            actions: [generateAction('Action1')]
          }
        ]);

        runInitRules(rules);

        var actionExport = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Action1')
        );
        expect(actionExport.calls.count()).toBe(1);
      });

      it('calls the rule action with the provided settings', function() {
        var rules = setupRules([
          {
            actions: [
              generateAction(
                'Action1',
                function(module) {
                  module.exports = jasmine.createSpy();
                },
                {
                  testAction1Foo: 1
                }
              )
            ]
          }
        ]);

        runInitRules(rules);

        var actionExport = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Action1')
        );
        var actionExportsCall = actionExport.calls.mostRecent();

        expect(actionExportsCall.args[0]).toEqual({
          testAction1Foo: 1
        });
      });

      it('executes all the rule actions provided', function() {
        var rules = setupRules([
          {
            actions: [generateAction('Action1'), generateAction('Action2')]
          }
        ]);

        runInitRules(rules);

        var actionExport1 = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Action1')
        );
        var actionExport2 = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Action2')
        );
        expect(actionExport1.calls.count()).toBe(1);
        expect(actionExport2.calls.count()).toBe(1);
      });

      it('executes all the rule actions in the order provided', function() {
        var callOrder = [];
        var rules = setupRules([
          {
            actions: [
              generateAction('Action1', function(module) {
                callOrder.push('Action1');
                module.exports = jasmine.createSpy();
              }),
              generateAction('Action2', function(module) {
                callOrder.push('Action2');
                module.exports = jasmine.createSpy();
              })
            ]
          }
        ]);

        runInitRules(rules);

        expect(callOrder).toEqual(['Action1', 'Action2']);
      });

      it('ceases to execute remaining conditions when condition fails', function() {
        var rules = setupRules([
          {
            conditions: [
              generateCondition('Condition1', function(module) {
                module.exports = jasmine.createSpy().and.returnValue(false);
              }),
              generateCondition('Condition2')
            ]
          }
        ]);

        runInitRules(rules);

        var conditionExport1 = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Condition1')
        );
        var conditionExport2 = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Condition2')
        );

        expect(conditionExport1.calls.count()).toBe(1);
        expect(conditionExport2.calls.count()).toBe(0);
      });

      it('ceases to execute remaining conditions when negated condition fails', function() {
        var rules = setupRules([
          {
            conditions: [
              Object.assign(
                { negate: true },
                generateCondition('Condition1', function(module) {
                  module.exports = jasmine.createSpy().and.returnValue(true);
                })
              ),
              generateCondition('Condition2')
            ]
          }
        ]);

        runInitRules(rules);

        var conditionExport1 = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Condition1')
        );
        var conditionExport2 = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Condition2')
        );

        expect(conditionExport1.calls.count()).toBe(1);
        expect(conditionExport2.calls.count()).toBe(0);
      });

      it('does not execute actions when condition fails', function() {
        var rules = setupRules([
          {
            conditions: [
              generateCondition('Condition1', function(module) {
                module.exports = jasmine.createSpy().and.returnValue(false);
              })
            ],
            actions: [generateAction('Action1')]
          }
        ]);

        runInitRules(rules);

        var conditionExport = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Condition1')
        );
        var actionExport = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Action1')
        );

        expect(conditionExport.calls.count()).toBe(1);
        expect(actionExport.calls.count()).toBe(0);
      });

      it('does not execute actions when negated condition fails', function() {
        var rules = setupRules([
          {
            conditions: [
              Object.assign(
                { negate: true },
                generateCondition('Condition1', function(module) {
                  module.exports = jasmine.createSpy().and.returnValue(true);
                })
              )
            ],
            actions: [generateAction('Action1')]
          }
        ]);

        runInitRules(rules);

        var conditionExport = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Condition1')
        );
        var actionExport = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Action1')
        );

        expect(conditionExport.calls.count()).toBe(1);
        expect(actionExport.calls.count()).toBe(0);
      });

      it('executes the events then the conditions then the actions', function() {
        var callOrder = [];
        var rules = setupRules([
          {
            events: [
              generateAction('Event1', function(module) {
                callOrder.push('Event1');
                module.exports = jasmine
                  .createSpy()
                  .and.callFake(function(settings, trigger) {
                    trigger(event);
                  });
              })
            ],
            conditions: [
              generateAction('Condition1', function(module) {
                callOrder.push('Condition1');
                module.exports = jasmine.createSpy().and.returnValue(true);
              })
            ],
            actions: [
              generateAction('Action1', function(module) {
                callOrder.push('Action1');
                module.exports = jasmine.createSpy();
              })
            ]
          }
        ]);

        runInitRules(rules);

        expect(callOrder).toEqual(['Event1', 'Condition1', 'Action1']);
      });

      it('does not throw error when there are no events for a rule', function() {
        var rules = setupRules([{}]);
        delete rules[0].events;

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );
      });

      it('does not throw error when there are no conditions for a rule', function() {
        var rules = setupRules([
          {
            conditions: [generateCondition('Condition')]
          }
        ]);
        delete rules[0].conditions;

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );
      });

      it('does not throw error when there are no actions for a rule', function() {
        var rules = setupRules([
          {
            actions: [generateAction('Action')]
          }
        ]);
        delete rules[0].actions;

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );
      });

      it('does not execute actions when actionsEnabled is false', function() {
        getShouldExecuteActions = function() {
          return false;
        };

        var rules = setupRules([
          {
            actions: [generateAction('Action1')]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        var actionExport = moduleProvider.getModuleExports(
          ModuleHelper.getPath('Action1')
        );

        expect(actionExport.calls.count()).toBe(0);
      });
    });

    describe('error handling and logging', function() {
      beforeEach(function() {
        logger = jasmine.createSpyObj('logger', ['log', 'error']);

        initRules = injectInitRules({
          './logger': logger,
          './createNotifyMonitors': function() {
            notifyMonitors = jasmine.createSpy();
            return notifyMonitors;
          }
        });
      });

      it('logs an error when retrieving event module exports fails', function() {
        var rules = setupRules([
          {
            events: [
              generateEvent('Event1', function() {
                throw new Error('noob tried to divide by zero.');
              })
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        var errorMessage = logger.error.calls.mostRecent().args[0];
        var expectedErrorMessage =
          'Failed to execute Event1 for Test Rule 1 rule. noob tried to divide by zero.';
        expect(errorMessage).toStartWith(expectedErrorMessage);
      });

      it('logs an error when the event module exports is not a function', function() {
        var rules = setupRules([
          {
            events: [
              generateEvent('Event1', function(module) {
                module.exports = {};
              })
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        var errorMessage = logger.error.calls.mostRecent().args[0];
        expect(errorMessage).toStartWith(
          'Failed to execute Event1 for Test Rule 1 rule. Module did not export a function.'
        );
      });

      it('logs an error when executing event module exports fails', function() {
        var rules = setupRules([
          {
            events: [
              generateEvent('Event1', function(module) {
                module.exports = function() {
                  throw new Error('noob tried to divide by zero.');
                };
              })
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        var errorMessage = logger.error.calls.mostRecent().args[0];
        var expectedErrorMessage =
          'Failed to execute Event1 for Test Rule 1 rule. noob tried to divide by zero.';
        expect(errorMessage).toStartWith(expectedErrorMessage);
      });

      it('logs an error when retrieving condition module exports fails', function() {
        var rules = setupRules([
          {
            conditions: [
              generateEvent('Condition1', function() {
                throw new Error('noob tried to divide by zero.');
              })
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        var errorMessage = logger.error.calls.mostRecent().args[0];
        var expectedErrorMessage =
          'Failed to execute Condition1 for Test Rule 1 rule. noob tried to divide by zero.';
        expect(errorMessage).toStartWith(expectedErrorMessage);
        expect(notifyMonitors).toHaveBeenCalledWith('ruleConditionFailed', {
          rule: rules[0],
          condition: rules[0].conditions[0]
        });
      });

      it('logs an error when the condition module exports is not a function', function() {
        var rules = setupRules([
          {
            conditions: [
              generateEvent('Condition1', function(module) {
                module.exports = {};
              })
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        var errorMessage = logger.error.calls.mostRecent().args[0];
        expect(errorMessage).toStartWith(
          'Failed to execute Condition1 for Test Rule 1 rule. Module did not export a function.'
        );
        expect(notifyMonitors).toHaveBeenCalledWith('ruleConditionFailed', {
          rule: rules[0],
          condition: rules[0].conditions[0]
        });
      });

      it('logs an error when executing condition module exports fails', function() {
        var rules = setupRules([
          {
            conditions: [
              generateEvent('Condition1', function(module) {
                module.exports = function() {
                  throw new Error('noob tried to divide by zero.');
                };
              })
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        var errorMessage = logger.error.calls.mostRecent().args[0];
        var expectedErrorMessage =
          'Failed to execute Condition1 for Test Rule 1 rule. noob tried to divide by zero.';
        expect(errorMessage).toStartWith(expectedErrorMessage);
        expect(notifyMonitors).toHaveBeenCalledWith('ruleConditionFailed', {
          rule: rules[0],
          condition: rules[0].conditions[0]
        });
      });

      it("logs a message when the condition doesn't pass", function() {
        var rules = setupRules([
          {
            conditions: [
              generateEvent('Condition1', function(module) {
                module.exports = function() {
                  return false;
                };
              })
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        expect(logger.log.calls.mostRecent().args[0]).toEqual(
          'Condition Condition1 for rule Test Rule 1 not met.'
        );
        expect(notifyMonitors).toHaveBeenCalledWith('ruleConditionFailed', {
          rule: rules[0],
          condition: rules[0].conditions[0]
        });
      });

      it("logs a message when the negated condition doesn't pass", function() {
        var rules = setupRules([
          {
            conditions: [
              Object.assign(
                {
                  negate: true
                },
                generateEvent('Condition1', function(module) {
                  module.exports = function() {
                    return true;
                  };
                })
              )
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        expect(logger.log.calls.mostRecent().args[0]).toEqual(
          'Condition Condition1 for rule Test Rule 1 not met.'
        );
        expect(notifyMonitors).toHaveBeenCalledWith('ruleConditionFailed', {
          rule: rules[0],
          condition: rules[0].conditions[0]
        });
      });

      it('logs an error when retrieving action module exports fails', function() {
        var rules = setupRules([
          {
            actions: [
              generateEvent('Action1', function() {
                throw new Error('noob tried to divide by zero.');
              })
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        var errorMessage = logger.error.calls.mostRecent().args[0];
        var expectedErrorMessage =
          'Failed to execute Action1 for Test Rule 1 rule. noob tried to divide by zero.';
        expect(errorMessage).toStartWith(expectedErrorMessage);
        expect(notifyMonitors).toHaveBeenCalledWith('ruleCompleted', {
          rule: rules[0]
        });
      });

      it('logs an error when the action module exports is not a function', function() {
        var rules = setupRules([
          {
            actions: [
              generateEvent('Action1', function(module) {
                module.exports = {};
              })
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        var errorMessage = logger.error.calls.mostRecent().args[0];
        expect(errorMessage).toStartWith(
          'Failed to execute Action1 for Test Rule 1 rule. Module did not export a function.'
        );
        expect(notifyMonitors).toHaveBeenCalledWith('ruleCompleted', {
          rule: rules[0]
        });
      });

      it('logs an error when executing action module exports fails', function() {
        var rules = setupRules([
          {
            actions: [
              generateEvent('Action1', function(module) {
                module.exports = function() {
                  throw new Error('noob tried to divide by zero.');
                };
              })
            ]
          }
        ]);

        initRules(
          _satellite,
          rules,
          moduleProvider,
          replaceTokens,
          getShouldExecuteActions
        );

        var errorMessage = logger.error.calls.mostRecent().args[0];
        var expectedErrorMessage =
          'Failed to execute Action1 for Test Rule 1 rule. noob tried to divide by zero.';
        expect(errorMessage).toStartWith(expectedErrorMessage);
        expect(notifyMonitors).toHaveBeenCalledWith('ruleCompleted', {
          rule: rules[0]
        });
      });
    });
  });
});
