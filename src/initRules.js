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

var replaceVarTokens = require('./public/replaceTokens');
var logger = require('./logger');
var state = require('./state');
var document = require('@adobe/reactor-document');
var normalizeSyntheticEvent = require('./normalizeSyntheticEvent');

var MODULE_NOT_FUNCTION_ERROR = 'Module did not export a function.';

var getModuleDisplayNameByRuleComponent = function(ruleComponent) {
  var moduleDefinition = state.getModuleDefinition(ruleComponent.modulePath);
  return (moduleDefinition && moduleDefinition.displayName) || ruleComponent.modulePath;
};

var getErrorMessage = function(ruleComponent, rule, errorMessage, errorStack) {
  var moduleDisplayName = getModuleDisplayNameByRuleComponent(ruleComponent);
  return 'Failed to execute ' + moduleDisplayName + ' for ' + rule.name + ' rule. ' +
    errorMessage + (errorStack ? '\n' + errorStack : '');
};

var runActions = function(rule, syntheticEvent) {
  if (state.getShouldExecuteActions() && rule.actions) {
    rule.actions.forEach(function(action) {
      action.settings = action.settings || {};

      var moduleExports;

      try {
        moduleExports = state.getModuleExports(action.modulePath);
      } catch (e) {
        logger.error(getErrorMessage(action, rule, e.message, e.stack));
        return;
      }

      if (typeof moduleExports !== 'function') {
        logger.error(getErrorMessage(action, rule, MODULE_NOT_FUNCTION_ERROR));
        return;
      }

      var settings = replaceVarTokens(action.settings, syntheticEvent);

      try {
        moduleExports(settings, syntheticEvent);
      } catch (e) {
        logger.error(getErrorMessage(action, rule, e.message, e.stack));
        return;
      }
    });
  }

  logger.log('Rule "' + rule.name + '" fired.');
};

var checkConditions = function(rule, syntheticEvent) {
  if (rule.conditions) {
    for (var i = 0; i < rule.conditions.length; i++) {
      var condition = rule.conditions[i];
      condition.settings = condition.settings || {};

      var moduleExports;

      try {
        moduleExports = state.getModuleExports(condition.modulePath);
      } catch (e) {
        logger.error(getErrorMessage(condition, rule, e.message, e.stack));
        return;
      }

      if (typeof moduleExports !== 'function') {
        logger.error(getErrorMessage(condition, rule, MODULE_NOT_FUNCTION_ERROR));
        return;
      }

      var settings = replaceVarTokens(condition.settings, syntheticEvent);

      var result;

      try {
        result = moduleExports(settings, syntheticEvent);
      } catch (e) {
        logger.error(getErrorMessage(condition, rule, e.message, e.stack));
        // We return because we want to assume the condition would have failed and therefore
        // we don't want to run the following conditions or the rule's actions.
        return;
      }

      if ((!result && !condition.negate) || (result && condition.negate)) {
        var conditionDisplayName = getModuleDisplayNameByRuleComponent(condition);
        logger.log('Condition ' + conditionDisplayName + ' for rule ' + rule.name + ' not met.');
        return;
      }
    }
  }

  runActions(rule, syntheticEvent);
};

var initEventModules = function(rule) {
  if (rule.events) {
    rule.events.forEach(function(event) {
      event.settings = event.settings || {};

      var moduleExports;
      var moduleName;
      var extensionName;

      try {
        moduleExports = state.getModuleExports(event.modulePath);
        moduleName = state.getModuleDefinition(event.modulePath).name;
        extensionName = state.getModuleExtensionName(event.modulePath);
      } catch (e) {
        logger.error(getErrorMessage(event, rule, e.message, e.stack));
        return;
      }

      if (typeof moduleExports !== 'function') {
        logger.error(getErrorMessage(event, rule, MODULE_NOT_FUNCTION_ERROR));
        return;
      }

      var settings = replaceVarTokens(event.settings);
      var syntheticEventType = extensionName + '.' + moduleName;

      /**
       * This is the callback that executes a particular rule when an event has occurred.
       * @callback ruleTrigger
       * @param {Object} [syntheticEvent] An object that contains detail regarding the event
       * that occurred.
       */
      var trigger = function(syntheticEvent) {
        checkConditions(rule, normalizeSyntheticEvent(syntheticEventType, syntheticEvent));
      };

      try {
        moduleExports(settings, trigger);
      } catch (e) {
        logger.error(getErrorMessage(event, rule, e.message, e.stack));
        return;
      }
    });
  }
};

module.exports = function() {
  state.getRules().forEach(function(rule) {
    initEventModules(rule);
  });
};

