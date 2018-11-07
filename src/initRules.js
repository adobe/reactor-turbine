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

var logger = require('./logger');
var normalizeSyntheticEvent = require('./normalizeSyntheticEvent');
var buildRuleExecutionOrder = require('./buildRuleExecutionOrder');
var createNotifyMonitors = require('./createNotifyMonitors');
var createExecuteDelegateModule = require('./createExecuteDelegateModule');
var isRuleQueueActive = require('./isRuleQueueActive');
var Promise = require('@adobe/reactor-promise');
var PROMISE_TIMEOUT = 2000;

var queueWarningLogged = false;
var logQueueWarningOnce = function() {
  if (!queueWarningLogged) {
    queueWarningLogged = true;
    logger.warn(
      'Rule queueing is only intended for testing purposes. Queueing behavior may be ' +
        'changed or removed at any time.'
    );
  }
};

module.exports = function(
  _satellite,
  rules,
  moduleProvider,
  replaceTokens,
  getShouldExecuteActions
) {
  var lastPromiseInQueue = Promise.resolve();
  var notifyMonitors = createNotifyMonitors(_satellite);
  var executeDelegateModule = createExecuteDelegateModule(
    moduleProvider,
    replaceTokens
  );

  var getModuleDisplayNameByRuleComponent = function(ruleComponent) {
    var moduleDefinition = moduleProvider.getModuleDefinition(
      ruleComponent.modulePath
    );
    return (
      (moduleDefinition && moduleDefinition.displayName) ||
      ruleComponent.modulePath
    );
  };

  var getErrorMessage = function(
    ruleComponent,
    rule,
    errorMessage,
    errorStack
  ) {
    var moduleDisplayName = getModuleDisplayNameByRuleComponent(ruleComponent);
    return (
      'Failed to execute ' +
      moduleDisplayName +
      ' for ' +
      rule.name +
      ' rule. ' +
      errorMessage +
      (errorStack ? '\n' + errorStack : '')
    );
  };

  var logActionError = function(action, rule, e) {
    logger.error(getErrorMessage(action, rule, e.message, e.stack));

    notifyMonitors('ruleActionFailed', {
      rule: rule,
      action: action
    });
  };

  var logConditionError = function(condition, rule, e) {
    logger.error(getErrorMessage(condition, rule, e.message, e.stack));

    notifyMonitors('ruleConditionFailed', {
      rule: rule,
      condition: condition
    });
  };

  var logConditionNotMet = function(condition, rule) {
    var conditionDisplayName = getModuleDisplayNameByRuleComponent(condition);

    logger.log(
      'Condition ' +
        conditionDisplayName +
        ' for rule ' +
        rule.name +
        ' not met.'
    );

    notifyMonitors('ruleConditionFailed', {
      rule: rule,
      condition: condition
    });
  };

  var logRuleCompleted = function(rule) {
    logger.log('Rule "' + rule.name + '" fired.');
    notifyMonitors('ruleCompleted', {
      rule: rule
    });
  };

  var normalizeError = function(e) {
    if (!e) {
      e = new Error(
        'The extension triggered an error, but no error information was provided.'
      );
    }

    if (!(e instanceof Error)) {
      e = new Error(String(e));
    }

    return e;
  };

  var isConditionMet = function(condition, result) {
    return (result && !condition.negate) || (!result && condition.negate);
  };

  var addRuleToQueue = function(rule, syntheticEvent) {
    if (rule.conditions) {
      rule.conditions.forEach(function(condition) {
        lastPromiseInQueue = lastPromiseInQueue.then(function() {
          var timeoutId;

          return new Promise(function(resolve, reject) {
            timeoutId = setTimeout(function() {
              // Reject instead of resolve to prevent subsequent
              // conditions and actions from executing.
              reject(
                'A timeout occurred because the condition took longer than ' +
                  PROMISE_TIMEOUT / 1000 +
                  ' seconds to complete. '
              );
            }, PROMISE_TIMEOUT);

            Promise.resolve(
              executeDelegateModule(condition, syntheticEvent, [syntheticEvent])
            ).then(resolve, reject);
          })
            .catch(function(e) {
              clearTimeout(timeoutId);
              e = normalizeError(e, condition);
              logConditionError(condition, rule, e);
              return Promise.reject(e);
            })
            .then(function(result) {
              clearTimeout(timeoutId);
              if (!isConditionMet(condition, result)) {
                logConditionNotMet(condition, rule);
                return Promise.reject();
              }
            });
        });
      });
    }

    if (getShouldExecuteActions() && rule.actions) {
      rule.actions.forEach(function(action) {
        lastPromiseInQueue = lastPromiseInQueue.then(function() {
          var timeoutId;

          return new Promise(function(resolve, reject) {
            timeoutId = setTimeout(function() {
              reject(
                'A timeout occurred because the action took longer than ' +
                  PROMISE_TIMEOUT / 1000 +
                  ' seconds to complete. '
              );
            }, PROMISE_TIMEOUT);

            Promise.resolve(
              executeDelegateModule(action, syntheticEvent, [syntheticEvent])
            ).then(resolve, reject);
          })
            .then(function() {
              clearTimeout(timeoutId);
            })
            .catch(function(e) {
              clearTimeout(timeoutId);
              e = normalizeError(e);
              logActionError(action, rule, e);
              return Promise.reject(e);
            });
        });
      });
    }

    lastPromiseInQueue = lastPromiseInQueue.then(function() {
      logRuleCompleted(rule);
    });

    // Allows later rules to keep running when an error occurs within this rule.
    lastPromiseInQueue = lastPromiseInQueue.catch(function() {});
  };

  var checkConditions = function(rule, syntheticEvent) {
    var condition;

    if (rule.conditions) {
      for (var i = 0; i < rule.conditions.length; i++) {
        condition = rule.conditions[i];

        try {
          var result = executeDelegateModule(condition, syntheticEvent, [
            syntheticEvent
          ]);

          if (!isConditionMet(condition, result)) {
            logConditionNotMet(condition, rule);
            return;
          }
        } catch (e) {
          logConditionError(condition, rule, e);
          return;
        }
      }
    }
    runActions(rule, syntheticEvent);
  };

  var runActions = function(rule, syntheticEvent) {
    var action;

    if (getShouldExecuteActions() && rule.actions) {
      for (var i = 0; i < rule.actions.length; i++) {
        action = rule.actions[i];
        try {
          executeDelegateModule(action, syntheticEvent, [syntheticEvent]);
        } catch (e) {
          logActionError(action, rule, e);
          return;
        }
      }

      logRuleCompleted(rule);
    }
  };

  var eventModulesInitialized = false;
  var triggerCallQueue = [];

  var initEventModule = function(ruleEventPair) {
    var rule = ruleEventPair.rule;
    var event = ruleEventPair.event;
    event.settings = event.settings || {};

    var moduleName;
    var extensionName;

    try {
      moduleName = moduleProvider.getModuleDefinition(event.modulePath).name;
      extensionName = moduleProvider.getModuleExtensionName(event.modulePath);

      var syntheticEventMeta = {
        $type: extensionName + '.' + moduleName,
        $rule: {
          id: rule.id,
          name: rule.name
        }
      };

      /**
       * This is the callback that executes a particular rule when an event has occurred.
       * @callback ruleTrigger
       * @param {Object} [syntheticEvent] An object that contains detail regarding the event
       * that occurred.
       */
      var trigger = function(syntheticEvent) {
        // DTM-11871
        // If we're still in the process of initializing event modules,
        // we need to queue up any calls to trigger, otherwise if the triggered
        // rule does something that triggers a different rule whose event module
        // has not been initialized, that secondary rule will never get executed.
        // This can be removed if we decide to always use the rule queue, since
        // conditions and actions will be processed asynchronously, which
        // would give time for all event modules to be initialized.
        if (!eventModulesInitialized) {
          triggerCallQueue.push(trigger.bind(null, syntheticEvent));
          return;
        }

        notifyMonitors('ruleTriggered', {
          rule: rule
        });

        var normalizedSyntheticEvent = normalizeSyntheticEvent(
          syntheticEventMeta,
          syntheticEvent
        );

        if (isRuleQueueActive()) {
          logQueueWarningOnce();
          addRuleToQueue(rule, normalizedSyntheticEvent);
        } else {
          checkConditions(rule, normalizedSyntheticEvent);
        }
      };

      executeDelegateModule(event, null, [trigger]);
    } catch (e) {
      logger.error(getErrorMessage(event, rule, e.message, e.stack));
    }
  };

  buildRuleExecutionOrder(rules).forEach(initEventModule);
  eventModulesInitialized = true;
  triggerCallQueue.forEach(function(triggerCall) {
    triggerCall();
  });
  triggerCallQueue = null;

  // We are returing the promise chain only for testing purposes.
  return lastPromiseInQueue;
};
