var replaceVarTokens = require('./utils/dataElement/replaceVarTokens');
var logger = require('./utils/logger');
var state = require('./state');

var runActions = function(rule, relatedElement, event) {
  if (state.getShouldExecuteActions() && rule.actions) {
    rule.actions.forEach(function(action) {
      action.settings = action.settings || {};

      var moduleExports;

      try {
        moduleExports = state.getModuleExports(action.modulePath);
      } catch (e) {
        return;
      }

      var settings = replaceVarTokens(action.settings, relatedElement, event);

      try {
        moduleExports(settings, relatedElement, event);
      } catch (e) {
        var moduleName = state.getModuleDisplayName(action.modulePath);
        var message = 'Error when executing ' + moduleName + ' action for '
          + rule.name + ' rule. Error message: ' + e.message;

        logger.error(message);
        // Don't re-throw the error because we want to continue execution.
        return;
      }
    });
  }

  logger.log('Rule "' + rule.name + '" fired.');
};

var checkConditions = function(rule, relatedElement, event) {
  if (rule.conditions) {
    for (var i = 0; i < rule.conditions.length; i++) {
      var condition = rule.conditions[i];
      condition.settings = condition.settings || {};

      var moduleExports;

      try {
        moduleExports = state.getModuleExports(condition.modulePath);
      } catch (e) {
        return;
      }

      var settings = replaceVarTokens(condition.settings, relatedElement, event);

      try {
        if (!moduleExports(settings, relatedElement, event)) {
          logger.log('Condition for rule ' + rule.name + ' not met.');
          return;
        }
      } catch (e) {
        var moduleName = state.getModuleDisplayName(condition.modulePath);
        var message = 'Error when executing ' + moduleName + ' condition for '
          + rule.name + ' rule. Error message: ' + e.message;

        logger.error(message);
        // Don't re-throw the error because we want to continue execution. We do return
        // however because we want to assume the condition would have failed and therefore
        // we don't want to run the rule's actions.
        return;
      }
    }
  }

  runActions(rule, relatedElement, event);
};

var initEventModules = function(rule) {
  if (rule.events) {
    /**
     * This is the callback that executes a particular rule when an event has occurred.
     * @callback ruleTrigger
     * @param {HTMLElement} [relatedElement] The element the rule targeted.
     * @param {Object} [event] An event object (native or synthetic) that contains detail
     * regarding the event that occurred.
     */
    var trigger = function(relatedElement, event) {
      checkConditions(rule, relatedElement, event);
    };

    rule.events.forEach(function(event) {
      event.settings = event.settings || {};

      var moduleExports;

      try {
        moduleExports = state.getModuleExports(event.modulePath);
      } catch (e) {
        return;
      }

      var settings = replaceVarTokens(event.settings);

      try {
        moduleExports(settings, trigger);
      } catch (e) {
        var moduleName = state.getModuleDisplayName(event.modulePath);
        var message = 'Error when executing ' + moduleName + ' event for '
          + rule.name + ' rule. Error message: ' + e.message;

        logger.error(message);
        // Don't re-throw the error because we want to continue execution.
      }
    });
  }
};

module.exports = function() {
  state.getRules().forEach(function(rule) {
    initEventModules(rule);
  });
};

