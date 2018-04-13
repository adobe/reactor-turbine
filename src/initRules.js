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

var MODULE_NOT_FUNCTION_ERROR = 'Module did not export a function.';

module.exports = function(
  _satellite,
  rules,
  moduleProvider,
  replaceTokens,
  getShouldExecuteActions
) {
  var notifyMonitors = createNotifyMonitors(_satellite);

  var getModuleDisplayNameByRuleComponent = function(ruleComponent) {
    var moduleDefinition = moduleProvider.getModuleDefinition(ruleComponent.modulePath);
    return (moduleDefinition && moduleDefinition.displayName) || ruleComponent.modulePath;
  };

  var getErrorMessage = function(ruleComponent, rule, errorMessage, errorStack) {
    var moduleDisplayName = getModuleDisplayNameByRuleComponent(ruleComponent);
    return 'Failed to execute ' + moduleDisplayName + ' for ' + rule.name + ' rule. ' +
      errorMessage + (errorStack ? '\n' + errorStack : '');
  };

  var runActions = function(rule, syntheticEvent) {
    if (getShouldExecuteActions() && rule.actions) {
      rule.actions.forEach(function(action) {
        action.settings = action.settings || {};

        var moduleExports;

        try {
          moduleExports = moduleProvider.getModuleExports(action.modulePath);
        } catch (e) {
          logger.error(getErrorMessage(action, rule, e.message, e.stack));
          return;
        }

        if (typeof moduleExports !== 'function') {
          logger.error(getErrorMessage(action, rule, MODULE_NOT_FUNCTION_ERROR));
          return;
        }

        var settings = replaceTokens(action.settings, syntheticEvent);

        try {
          moduleExports(settings, syntheticEvent);
        } catch (e) {
          logger.error(getErrorMessage(action, rule, e.message, e.stack));
          return;
        }
      });
    }

    logger.log('Rule "' + rule.name + '" fired.');
    notifyMonitors('ruleCompleted', {
      rule: rule
    });
  };

  var checkConditions = function(rule, syntheticEvent) {
    if (rule.conditions) {
      for (var i = 0; i < rule.conditions.length; i++) {
        var condition = rule.conditions[i];
        condition.settings = condition.settings || {};

        var moduleExports;

        try {
          moduleExports = moduleProvider.getModuleExports(condition.modulePath);
        } catch (e) {
          logger.error(getErrorMessage(condition, rule, e.message, e.stack));
          return;
        }

        if (typeof moduleExports !== 'function') {
          logger.error(getErrorMessage(condition, rule, MODULE_NOT_FUNCTION_ERROR));
          return;
        }

        var settings = replaceTokens(condition.settings, syntheticEvent);

        var result;

        try {
          result = moduleExports(settings, syntheticEvent);
        } catch (e) {
          logger.error(getErrorMessage(condition, rule, e.message, e.stack));
          notifyMonitors('ruleConditionFailed', {
            rule: rule,
            condition: condition
          });
          // We return because we want to assume the condition would have failed and therefore
          // we don't want to run the following conditions or the rule's actions.
          return;
        }

        if ((!result && !condition.negate) || (result && condition.negate)) {
          var conditionDisplayName = getModuleDisplayNameByRuleComponent(condition);
          logger.log('Condition ' + conditionDisplayName + ' for rule ' + rule.name + ' not met.');
          notifyMonitors('ruleConditionFailed', {
            rule: rule,
            condition: condition
          });
          return;
        }
      }
    }

    runActions(rule, syntheticEvent);
  };

  var initEventModule = function(ruleEventPair) {
    var rule = ruleEventPair.rule;
    var event = ruleEventPair.event;
    event.settings = event.settings || {};

    var moduleExports;
    var moduleName;
    var extensionName;

    try {
      moduleExports = moduleProvider.getModuleExports(event.modulePath);
      moduleName = moduleProvider.getModuleDefinition(event.modulePath).name;
      extensionName = moduleProvider.getModuleExtensionName(event.modulePath);
    } catch (e) {
      logger.error(getErrorMessage(event, rule, e.message, e.stack));
      return;
    }

    if (typeof moduleExports !== 'function') {
      logger.error(getErrorMessage(event, rule, MODULE_NOT_FUNCTION_ERROR));
      return;
    }

    var settings = replaceTokens(event.settings);

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
      notifyMonitors('ruleTriggered', {
        rule: rule
      });
      checkConditions(rule, normalizeSyntheticEvent(syntheticEventMeta, syntheticEvent));
    };

    try {
      moduleExports(settings, trigger);
    } catch (e) {
      logger.error(getErrorMessage(event, rule, e.message, e.stack));
      return;
    }
  };

  buildRuleExecutionOrder(rules).forEach(initEventModule);
};

