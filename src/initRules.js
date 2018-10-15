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
var createGetDelegatesChain = require('./createGetDelegatesChain');
var getNamespacedStorage = require('./getNamespacedStorage');
var createRunModule = require('./createRunModule');
var localStorage = getNamespacedStorage('localStorage');
var lastPromiseInQueue = Promise.resolve(null);
var CONDITION_NOT_MET = 'condition not met';

module.exports = function(
  _satellite,
  rules,
  moduleProvider,
  replaceTokens,
  getShouldExecuteActions
) {
  var notifyMonitors = createNotifyMonitors(_satellite);
  var runModule = createRunModule(moduleProvider, replaceTokens);

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

  var logActionError = function(component, rule, e) {
    logger.error(getErrorMessage(component, rule, e.message, e.stack));
  };

  var logConditionError = function(component, rule, e) {
    logger.error(getErrorMessage(component, rule, e.message, e.stack));

    notifyMonitors('ruleConditionFailed', {
      rule: rule,
      condition: component,
    });
  };

  var logConditionNotMet = function(rule, condition) {
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
      condition: condition,
    });
  };

  var logRuleCompleted = function(rule) {
    logger.log('Rule "' + rule.name + '" fired.');
    notifyMonitors('ruleCompleted', {
      rule: rule,
    });
  };

  var getDelegatesChain = createGetDelegatesChain(runModule);

  var checkConditionResult = function(data) {
    var result = data.result;
    var condition = data.component;

    if ((!result && !condition.negate) || (result && condition.negate)) {
      throw new Error(CONDITION_NOT_MET);
    }
  };

  var addRuleToQueue = function(rule, syntheticEvent) {
    var conditionsChain = Promise.resolve();

    if (rule.conditions) {
      conditionsChain = getDelegatesChain(
        rule.conditions,
        rule,
        syntheticEvent,
        logConditionError,
        function(condition, conditionResult) {
          try {
            checkConditionResult({
              component: condition,
              result: conditionResult,
            });
          } catch (e) {
            logConditionNotMet(rule, condition);
            throw e;
          }
        },
        true
      );
    }

    if (getShouldExecuteActions() && rule.actions) {
      var actionsChain = getDelegatesChain(
        rule.actions,
        rule,
        syntheticEvent,
        logActionError
      );

      lastPromiseInQueue = lastPromiseInQueue
        .then(conditionsChain)
        .then(actionsChain)
        .then(logRuleCompleted.bind(null, rule))
        // The only errors that should get to this catch are `condition not met`
        // errors or promises that are rejected. This catch will allow the
        // promises of the following rules in the chain to run like nothing happened.
        .catch(function() {});
    }
  };

  var checkConditions = function(rule, syntheticEvent) {
    var condition;

    if (rule.conditions) {
      for (var i = 0; i < rule.conditions.length; i++) {
        condition = rule.conditions[i];

        try {
          var result = runModule(condition, syntheticEvent, [syntheticEvent]);

          try {
            checkConditionResult({
              result: result,
              component: condition,
            });
          } catch (e) {
            logConditionNotMet(rule, condition);
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
    if (getShouldExecuteActions()) {
      (rule.actions || []).forEach(function(action) {
        try {
          runModule(action, syntheticEvent, [syntheticEvent]);
        } catch (e) {
          logActionError(action, rule, e);
        }
      });

      logRuleCompleted(rule);
    }
  };

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
          name: rule.name,
        },
      };

      /**
       * This is the callback that executes a particular rule when an event has occurred.
       * @callback ruleTrigger
       * @param {Object} [syntheticEvent] An object that contains detail regarding the event
       * that occurred.
       */
      var trigger = function(syntheticEvent) {
        notifyMonitors('ruleTriggered', {
          rule: rule,
        });

        var normalizedSyntethicEvent = normalizeSyntheticEvent(
          syntheticEventMeta,
          syntheticEvent
        );

        if (localStorage.getItem('queue')) {
          addRuleToQueue(rule, normalizedSyntethicEvent);
        } else {
          checkConditions(rule, normalizedSyntethicEvent);
        }
      };

      runModule(event, null, [trigger]);
    } catch (e) {
      logger.error(getErrorMessage(event, rule, e.message, e.stack));
    }
  };

  buildRuleExecutionOrder(rules).forEach(initEventModule);
};
